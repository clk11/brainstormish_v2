import client from './redisClient.js';
import { getters } from './getters.js';
const { get_date } = getters;
async function set_user_profile(user) {
    const { username, date } = user;
    await client.hmset(`profile:${username}`,
        'username', username,
        'date', date
    );
    await client.sadd(`profiles`, `profile:${username}`)
}

async function set_user_private_profile(user) {
    const { id, username, date, email } = user;
    await client.hmset(`private-profile:${username}`,
        'id', id,
        'email', email,
        'username', username,
        'date', date
    );
    await client.sadd(`private-profiles`, `private-profile:${username}`);
}

async function set_user_post(user, post) {
    const { title, description, date, tags, postid } = post;
    const postKey = `post:${postid}`;
    const stringifedTags = JSON.stringify(tags);
    await client.hmset(postKey,
        'id', postid,
        'title', title,
        'username', user, //author
        'description', description,
        'date', date,
        'tags', stringifedTags
    );
    await join_user_post(user, postid);
    await client.sadd('posts', postKey);
}

async function join_user_post(user, postid) {
    await client.sadd(`${user}-posts`, `post:${postid}`);
}

async function create_connection(user, postid, socketid) {
    await client.zadd(`post-room:${postid}:users`, 1, user);
    await client.hmset(`member:${socketid}`, 'user', user, 'room', postid);
    // erase the elements of this set in case of server failure
    await client.sadd('member-ids', `member:${socketid}`);
    // set all the user statuses to 0 since in case of a server failure the statuses will remain the same as in the very moment the server crashed
    await client.sadd('rooms', `post-room:${postid}:users`);
}

async function refresh_connection(user, postid, socketid) {
    const member_id = await client.hgetall(`member:${socketid}`);
    if (member_id !== null)
        await client.zadd(`post-room:${postid}:users`, 1, user);
    else await client.hmset(`member:${socketid}`, 'user', user, 'room', postid);
}

async function disconnect_user(socketid) {
    const get_user = await client.hgetall(`member:${socketid}`);
    if (get_user !== null) {
        const { user, room } = get_user;
        await client.zadd(`post-room:${room}:users`, 0, user);
        await client.del(`member:${socketid}`);
    }
}

async function add_message(username, postid, message) {
    const messageid = await client.get('message-id');
    if (messageid === null) await client.set('message-id', 1);
    const postMessageKey = `message:${messageid === null ? 1 : messageid}`;
    const date = await get_date();
    await client.hmset(postMessageKey,
        'user', username,
        'message', message,
        'date', date
    )
    await client.rpush(`post-room:${postid}:messages`, postMessageKey);
    await client.incr('message-id');
}

export const setters = {
    set_user_profile,
    set_user_private_profile,
    set_user_post,
    join_user_post,
    add_message,
    disconnect_user,
    create_connection,
    refresh_connection
}