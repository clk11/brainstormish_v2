import client from './redisClient.js'

async function get_not_joined(user) {
    const userKey = `${user}-posts`;
    const _posts = await client.smembers('posts');
    let posts = [];
    for (let i = 0; i < _posts.length; i++) {
        const postKey = _posts[i];
        const checkExists = await client.sismember(userKey, postKey);
        if (!checkExists) {
            let post = await client.hgetall(postKey);
            const tags = JSON.parse(post.tags);
            post.tags = tags;
            post.status = 0;
            posts.push(post);
        }
    }
    return posts.length !== 0 ? posts : [];
}

async function get_posts(user, condition) {
    const userKey = `${user}-posts`;
    let _posts = await client.smembers(userKey);
    let posts = [];

    for (let i = 0; i < _posts.length; i++) {
        let post = await client.hgetall(_posts[i]);
        if (condition === 0) {
            if (post.username !== user) {
                const tags = JSON.parse(post.tags);
                post.tags = tags;
                posts.push(post);
            }
        } else {
            if (post.username === user) {
                const tags = JSON.parse(post.tags);
                post.tags = tags;
                posts.push(post);
            }
        }
    }
    return posts.length !== 0 ? posts : [];
}


async function get_user_posts(user1, user2, created) {
    let posts = [];
    if (user1 === user2) {
        posts = await get_posts(user1, created);
    } else {
        const user1PostsKey = `${user1}-posts`;
        let user2Posts = await get_posts(user2, created);
        for (let i = 0; i < user2Posts.length; i++) {
            let post = user2Posts[i];
            const postKey = `post:${post.id}`;
            const checkJoined = await client.sismember(user1PostsKey, postKey);
            if (checkJoined)
                post.status = 1
            else post.status = 0;
            posts.push(post);
        }
    }
    return posts;
}


async function get_user_posts_created(user1, user2) {
    const posts = await get_user_posts(user1, user2, 1);
    return posts;
}

async function get_user_posts_joined(user1, user2) {
    const posts = await get_user_posts(user1, user2, 0);
    return posts;
}


async function get_user_profile(username) {
    const user = await client.hgetall(`profile:${username}`);
    return user;
}

async function get_user_private_profile(username) {
    const user = await client.hgetall(`private-profile:${username}`);
    return user;
}

async function get_post_members(postid) {
    const post_users_raw = await client.zrange(`post-room:${postid}:users`, 0, -1, 'WITHSCORES');
    let post_users = [];
    for (let i = 0; i < post_users_raw.length; i += 2) {
        const username = post_users_raw[i];
        const status = post_users_raw[i + 1];
        post_users.push({ username, status });
    }
    return post_users;
}

async function get_post_messages(postid, right) {
    const decr = 4;
    const left = right - decr; // first right is -1 and then we go to the left
    const post_messages = await client.lrange(`post-room:${postid}:messages`, left, right);
    let messages = [];
    for (let i = 0; i < post_messages.length; i++) {
        const messageKey = post_messages[i];
        const messageInfo = await client.hgetall(messageKey);
        messages.push({ id: messageKey, username: messageInfo.user, message: messageInfo.message });
    }
    return messages;
}

async function get_membership_status(user, postid) {
    const check = await client.sismember(`${user}-posts`, `post:${postid}`);
    if (check) return true;
    else return false;
}

async function get_date() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
    return formattedDate;
}

export const getters = {
    get_user_posts_created,
    get_user_posts_joined,
    get_not_joined,
    get_post_members,
    get_user_profile,
    get_user_private_profile,
    get_post_messages,
    get_membership_status,
    get_date
}