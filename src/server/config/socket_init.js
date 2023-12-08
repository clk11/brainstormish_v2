import { Server } from "socket.io";

import { cache_functions } from '../caching/caching.js';

const { getters, setters } = cache_functions;

const { add_message, disconnect_user, create_connection, refresh_connection } = setters;

const { get_post_members, get_post_messages, get_membership_status } = getters;

import dotenv from 'dotenv';
dotenv.config();

const initializeSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: process.env.FN_URL,
            methods: ["GET", "POST"],
            credentials: true,
            allowHeaders: ["Content-Type", "Authorization"],
        }
    });

    io.on("connection", (socket) => {
        const heartbeatInterval = setInterval(() => {
            socket.emit('heart_beat');
        }, 2000);
        socket.on('disconnect', async () => {
            await disconnect_user(socket.id);
            clearInterval(heartbeatInterval);
        });
        socket.on('heart_beat_received', async (user) => {
            const { username, room } = user;
            await refresh_connection(username, room, socket.id);
        });
        socket.on("join_room", async (obj) => {
            const { username, room } = obj;
            await create_connection(username, room, socket.id);
            socket.join(room);
        });
        socket.on("send_message", async (obj) => {
            const { user, message } = obj;
            const { username, room } = user;
            await add_message(username, room, message);
            socket.broadcast.to(room).emit("received_message", obj);
        });
        socket.on("get_users", async (room) => {
            const users = await get_post_members(room);
            socket.emit('getting_users', users);
        });
        socket.on("get_messages", async ({ room, right }) => {
            const messages = await get_post_messages(room, right);
            socket.emit("getting_messages", messages);
        });
        socket.on("get_membership", async (obj) => {
            const { user, room } = obj;
            const status = await get_membership_status(user, room);
            socket.emit("received_membership", status);
        })
    })
}

export default initializeSocket;