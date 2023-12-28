import * as React from 'react';
import { Paper, Container, Grid, Divider, Button, useMediaQuery } from '@mui/material';
import { useState, useEffect } from 'react';
import ChatMessages from './ChatMessages';
import ChatUsers from './ChatUsers';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import Progress from '../Layout/ProgressBar';

const ChatComponent = ({ user, socket }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [right, setRight] = useState(-1);
    const [empty, setEmpty] = useState(null);
    const [loadMoreVisibility, setLoadMoreVisibility] = useState(false);
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    useEffect(() => {
        const fetch = async () => {
            await joinRoom();
            await getMessages();
        }
        fetch();
        const handleReceivedMessage = obj => {
            setMessages(prev => [...prev, { message: obj.message, username: obj.user.username }]);
        };

        const handleGettingUsers = obj => {
            setUsers(obj);
        };

        const handleGettingMessages = mess => {
            if (mess.length === 0) {
                setLoadMoreVisibility(false);
                setEmpty(true);
            } else {
                setEmpty(false);
                setMessages((prev) => {
                    let new_arr = prev === null ? [] : prev;
                    for (let i = mess.length - 1; i >= 0; i--) {
                        if (!new_arr.some(x => x.id === mess[i].id))
                            new_arr.unshift(mess[i]);
                    }
                    return new_arr;
                });
                setRight(prev => prev - 6);
            };
            setLoading(false);
        }

        socket.on('received_message', handleReceivedMessage);
        socket.on('getting_users', handleGettingUsers);
        socket.on('getting_messages', handleGettingMessages);
        socket.on('heart_beat', handleHeartBeat);

        //

        return () => {
            socket.off('received_message', handleReceivedMessage);
            socket.off('getting_users', handleGettingUsers);
            socket.off('getting_messages', handleGettingMessages);
            socket.off('heart_beat', handleHeartBeat);
        };
    }, []);

    async function getMessages() {
        await socket.emit('get_messages', { room: user.room, right });
        setLoading(true);
    }

    async function getUsers() {
        await socket.emit('get_users', user.room);
        setOpen(true);
    }

    async function handleHeartBeat() {
        await socket.emit('heart_beat_received', user);
        await socket.emit('get_users', user.room);
    }

    async function joinRoom() {
        const { username, room } = user;
        if (socket) {
            socket.emit('join_room', { username, room });
        }
    };

    async function onSend() {
        const message = document.getElementById('message').value;
        if (message.trim().length !== 0) {
            const newMessage = { message: message, username: user.username };
            await socket.emit('send_message', { user, message });
            setMessages(prev => [...prev, newMessage]);
            setRight(prev => prev - 1);
            document.getElementById('message').value = '';
        }
    }

    return (
        <Container maxWidth="md" sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
            {loading && (
                <Progress />
            )}
            {!loading && (
                <Paper elevation={5} sx={{ borderStyle: 'solid', borderColor: 'Grey', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <ChatUsers open={open} setOpen={setOpen} users={users} navigate={navigate} />
                    <Grid container justifyContent={'flex-end'} spacing={2}>
                        <Grid item>
                            <Button
                                variant="contained" onClick={getUsers}>PARTICIPANTS
                            </Button>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid container justifyContent={'center'} sx={{ flex: 1 }}>
                        {loadMoreVisibility && (
                            <Button onClick={async () => await getMessages()}>Load more</Button>
                        )}
                        <Grid item xs={12} sx={{ overflowY: 'auto' }}>
                            <ChatMessages empty={empty} setLoadMoreVisibility={setLoadMoreVisibility} messages={messages} navigate={navigate} />
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="flex-end" sx={{ padding: 2 }}>
                        <Grid item xs>
                            <TextField
                                fullWidth
                                id='message'
                                variant="outlined"
                                onKeyDown={(e) => { if (e.key === 'Enter') onSend() }}
                                placeholder="Type a message"
                            />
                        </Grid>
                        <Grid item>
                            {!isSmallScreen && (
                                <Button sx={{ height: '3.5rem' }} variant="contained" endIcon={<SendIcon />} onClick={onSend}>
                                    Send
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </Container>
    );


}

export default ChatComponent;
