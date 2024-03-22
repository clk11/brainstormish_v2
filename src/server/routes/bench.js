import express from 'express'
import auth from '../middlewares/auth.js';
import db from '../config/db.js';
import { middlewares, cache_functions } from '../caching/caching.js';
const router = express.Router();
const { cache_post_members, cache_post_messages } = middlewares;
const { getters } = cache_functions;
const { get_membership_status } = getters;

// @route => /bench/membership
// @desc => Check to see if the user is eligible to join the post
// @access => Private

router.get('/membership', auth, async (req, res) => {
    try {
        const { room } = req.query;
        const status = await get_membership_status(req.user.username, room);
        res.json(status);
    } catch (error) {
        res.status(500).send({ err: 'Server error .' });
    }
})

// @route => /bench/member/:info
// @desc => Get conversation members
// @access => Private

router.get('/members', auth, cache_post_members, async (_, res) => {
    //If in the future i want to include the data retrieval code from the database_queries.js
    //till then im calling permission denied every time the cache fails

    res.status(401).send({ msg: 'Permission denied !' });
});


// @route => /bench/messages
// @desc => Get conversation messages
// @access => Private

router.get('/messages', auth, cache_post_messages, async (_, res) => {

    res.status(401).send({ msg: 'Permission denied !' });
});

// @route => /bench/addMessage
// @desc => Post a message to the database
// @access => Private

router.post('/addMessage', auth, async (req, res) => {
    try {
        const { message, memberid } = req.body;
        if (message.length != 0) {
            await db.query(`insert into t_message(message,id_member)values($1,$2);`, [message, memberid]);
        } else res.status(400).send({ err: 'You need to add a message !' });
    } catch (err) {
        res.status(400).send({ err: 'Something went wrong !' });
    }
    res.status(200).send();
});

export default router;