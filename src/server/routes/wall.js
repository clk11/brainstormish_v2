import express from 'express';
import { check, validationResult } from 'express-validator'
import auth from '../middlewares/auth.js';
import db from '../config/db.js';
import { middlewares, cache_functions } from '../caching/caching.js';
const router = express.Router();
//----Caching
//Middlewares
const { cache_user_profiles } = middlewares;
//Functions
const { getters, setters } = cache_functions;
const { get_not_joined, get_user_posts_created, get_user_posts_joined, get_date } = getters;
const { set_user_post, set_user_profile, join_user_post } = setters;
//


// @route => /wall
// @desc => Add a new post
// @access => Private
router.post(
	'/',
	[
		check('title')
			.isLength({ min: 2, max: 1000 })
			.withMessage('The title should be between 2 chars and 10000 !'),
		check('description')
			.isLength({ min: 20, max: 10000 })
			.withMessage('The description should be between 20 chars and 10000 !'),
		check('tags')
			.isArray({ min: 1 })
			.withMessage('You should add at least one tag !'),
	],
	auth,
	async (req, res) => {
		const err = validationResult(req);
		if (err.isEmpty()) {
			try {
				const { description, title, tags } = req.body;
				const userid = (
					await db.query(`select id from t_user where username = $1;`, [
						req.user.username,
					])
				).rows[0].id;
				const postid = (
					await db.query(
						`insert into t_post(id_user,title,description)values($1,$2,$3) returning id;`,
						[userid, title, description]
					)
				).rows[0].id;
				//cache update
				await set_user_post(req.user.username, { title, description, tags, date: await get_date(), postid });
				//
				tags.forEach(async (tag) => {
					const tag_row = (await db.query(`select id from t_tag where tag = $1`, [tag])).rows[0];
					let tagId = null;
					if (!tag_row) {
						tagId = (
							await db.query(`insert into t_tag(tag)values($1) RETURNING id;`, [
								tag,
							])
						).rows[0].id;
					} else tagId = tag_row.id;
					await db.query(
						`insert into t_tagPost(id_post,id_tag)values($1,$2);`,
						[postid, tagId]
					);
				});
				await db.query(`insert into t_member(id_user,id_post)values($1,$2)`, [userid, postid]);
				return res.status(200).send();
			} catch (err) {
				res.status(500).send({ err: 'Server error .' });
			}
		} else return res.status(500).send({ err: err.array().map(x => x.msg)  });
	}
);

// @route => /wall
// @desc => Get the posts
// @access => Private

router.get('/', auth, async (req, res) => {
	try {
		const posts = await get_not_joined(req.user.username);
		res.json(posts);
	} catch (err) {
		res.status(400).send({ err: 'Something went wrong !' });
	}
});

// @route => /wall/:user/posts
// @desc => Get user's posts (created)
// @access => Private

router.get('/:user/posts', auth, async (req, res) => {
	try {
		const posts = await get_user_posts_created(req.user.username, req.params.user);
		res.json(posts);
	} catch (err) {
		res.status(400).send({ err: 'Something went wrong !' });
	}
});

// @route => /wall/:user/posts/joined
// @desc => Get user's joined posts
// @access => Private

router.get('/:user/posts/joined', auth, async (req, res) => {
	try {
		const posts = await get_user_posts_joined(req.user.username, req.params.user);
		res.json(posts);
	} catch (err) {
		res.status(400).send({ err: 'Something went wrong !' });
	}
});

// @route => /wall/profile/:user
// @desc => Get user's profile
// @access => Private

router.get('/profile/:user', auth, cache_user_profiles, async (req, res) => {
	try {
		const user = (await db.query(
			`select username,to_char(date, 'DD/MM/YYYY at HH24:MI') AS date from t_user where username = $1`,
			[req.params.user]
		)).rows[0];
		await set_user_profile(user);
		res.json(user);
	} catch (err) {
		res.status(400).send({ err: 'Something went wrong !' });
	}
});

// @route => /wall/join
// @desc => Join a discussion
// @access => Private

router.post('/join', auth, async (req, res) => {
	try {
		const { admin_username, id_post } = req.body;
		await join_user_post(req.user.username, id_post);
		if (admin_username !== req.user.username) {
			const record = await db.query(`select * from t_member where id_user = $1 and id_post = $2`, [req.user.id, id_post]);
			if (record.rows.length === 0)
				await db.query(`insert into t_member(id_user,id_post)values($1,$2)`, [req.user.id, id_post]);
			else return res.status(400).send({ err: "You've already joined the discussion !" });
		}
		else
			return res.status(400).send({ err: "You're the admin of the conversation , so you're already there !" });
		res.sendStatus(200);
	} catch (err) {
		res.status(400).send({ err: 'Something went wrong!' });
	}
});


export default router;
