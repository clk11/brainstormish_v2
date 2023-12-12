import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import { check, validationResult, query } from 'express-validator';
import auth from '../middlewares/auth.js';
import db from '../config/db.js';
import { middlewares, cache_functions } from '../caching/caching.js';
const { getters } = cache_functions;
const { get_mail_id } = getters;
import dotenv from 'dotenv'
export const router = express.Router();
//Caching
const { cache_user_private_profiles } = middlewares;
const { setters } = cache_functions
const { set_user_private_profile } = setters;
//
dotenv.config();
// @route => /auth
// @desc => Get the user
// @access => Private
router.get('/', auth, cache_user_private_profiles, async (req, res) => {
	try {
		const { username } = req.user;
		const user = (await db.query(
			`select id,username,email,to_char(date, 'DD/MM/YYYY at HH24:MI') AS date from t_User where username=$1`,
			[username]
		)).rows[0];
		await set_user_private_profile(user);
		res.json(user);
	} catch (err) {
		res.status(401).send({ msg: 'Permission denied !' });
	}
});

// @route => /auth
// @desc => Log the user
// @access => Public

router.post(
	'/',
	[
		check('username')
			.not()
			.isEmpty()
			.withMessage("Username shouldn't be empty !"),
		check('password')
			.not()
			.isEmpty()
			.withMessage("Password shouldn't be empty !"),
	],
	async (req, res) => {
		const err = validationResult(req);
		if (!err.isEmpty()) return res.status(400).send({ err: err.array().map(x => x.msg) });
		try {
			const { username, password } = req.body;
			const record = await db.query(`select * from t_User where username=$1;`, [
				username,
			]);
			const user = record.rows[0];
			if (user) {
				const isMatch = await bcrypt.compare(password, user.password);
				if (!isMatch)
					return res.status(400).send({ err: 'Invalid credentials .' });
			} else return res.status(400).send({ err: 'Invalid credentials .' });
			let payload = {
				user: {
					username,
					id: user.id,
				},
			};
			const expir = 3600; // 3600ms -> 1hr
			const token = jwt.sign(payload, config.get('jwtSecret'), {
				expiresIn: expir + 's',
			});
			res.cookie('token', token, {
				httpOnly: true,
				secure: process.env.PRODUCTION === 'yes' ? true : false,
				maxAge: expir * 1000,
			});
			res.json({ status: 1 });
		} catch (err) {
			res.status(500).send({ err: 'Server error !' });
		}
	}
);

// @route => /auth/validate_credentials
// @desc => Validate the credentials
// @access => Public

router.get(
	'/validate_credentials',
	[
		query('username')
			.not()
			.isEmpty()
			.withMessage("Username shouldn't be empty !"),
		query('password')
			.isLength({ min: 6, max: 15 })
			.withMessage('You should add a password between 6 and 15 chars !'),
		query('email').isEmail().withMessage('You need to enter a valid email !'),
		query('rpassword')
			.custom((value, { req }) => {
				if (value !== req.query.password) {
					throw new Error('Your passwords do not match.');
				}
				return true;
			}),
	],
	async (req, res) => {
		let err = validationResult(req);
		if (err.isEmpty()) {
			const { username, email } = req.query;
			try {
				err = [];
				let record = await db.query(
					`select * from t_user where username=$1;`,
					[username]
				);
				const check_username = record.rows[0];
				record = await db.query(
					`select * from t_user where email=$1;`,
					[email]
				);
				const check_email = record.rows[0];
				if (check_username !== undefined) err.push('Username already in use !')
				if (check_email !== undefined) err.push('Email already in use !')
				if (check_username !== undefined || check_email !== undefined)
					return res.status(500).send({ err });
				res.json({ status: 1 });
			} catch (err) {
				res.status(500).send({ err: 'Server error .' });
			}
		} else
			res.status(500).send({ err: err.array().map(x => x.msg) });
	}
);


// @route => /auth/register
// @desc => Add a new user
// @access => Private

router.post('/register', async (req, res) => {
	try {
		const { user, userid } = req.body;
		const valid = await get_mail_id(userid);
		if (valid === 'granted') {
			const { username, password, email } = user;
			const salt = await bcrypt.genSalt(10);
			const safePassword = await bcrypt.hash(password, salt);
			await db.query(
				`insert into t_user (username,password,email)values($1,$2,$3);`,
				[username, safePassword, email]
			);
			res.json({ status: 1 });
		} else res.status(400).send({ err: 'Not granted .' });
	} catch (error) {
		res.status(500).send({ err: 'Server error .' });
	}
});

// @route => /session
// @desc => Check the token
// @access => Private

router.get('/session', auth, (_, res) => {
	res.sendStatus(200);
});


// @route => /clear_session
// @desc => logout
// @access => Private

router.get('/clear_session', auth, (_, res) => {
	res.clearCookie('token');
	res.sendStatus(200);
});

export default router;