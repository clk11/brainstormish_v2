import { getters } from './getters.js';
import { setters } from './setters.js';

async function cache_user_profiles(req, res, next) {
    const user = await getters.get_user_profile(req.params.user);
    if (user !== null)
        res.send(user);
    else next();
}

async function cache_user_private_profiles(req, res, next) {
    const user = await getters.get_user_private_profile(req.user.username);
    if (user !== null)
        res.send(user);
    else next();
}

async function cache_post_members(req, res, next) {
    const { postid } = req.query;
    let members = null;
    members = await getters.get_post_members(postid);
    if (members !== null)
        res.json(members);
    else next();
}

async function cache_post_messages(req, res, next) {
    const { postid } = req.query;
    let messages = null;
    messages = await getters.get_post_messages(postid);
    if (messages !== null)
        res.json({ messages, username: req.user.username });
    else next();
}

export const middlewares = {
    cache_user_profiles,
    cache_user_private_profiles,
    cache_post_members,
    cache_post_messages
};
export const cache_functions = {
    getters,
    setters
};