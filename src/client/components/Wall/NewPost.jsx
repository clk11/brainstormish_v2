import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import { wallAC } from '../../../redux/features/';
import { connect } from 'react-redux';
import TagsList from './TagsList';
import Snack from "../Layout/SnackBar/Snack";

const NewPost = ({ addPost, errors }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const handleCreatePost = async () => {
        const res = await addPost({ title, description, tags });
        if (res === 1) {
            setAlertMessage('Post created successfully!');
            setOpen(true);
            setTimeout(() => {
                navigate('/');
            }, 500);
        } else {
            setOpen(true);
        }
    };

    return (
        <>
            <Snack alertMessage={alertMessage} open={open} setOpen={setOpen} errors={errors} />
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-end"
                flexDirection="column"
                mx="auto"
                mt="2rem"
                borderRadius="0.375rem"
                width="80%"
                maxWidth="50rem"
                sx={{
                    border: !isSmallScreen ? '1px solid #ccc' : 'none',
                    padding: !isSmallScreen ? '1rem' : '0',
                }}
            >
                <Typography pb={3} variant="h5" gutterBottom>
                    Add a New Post
                </Typography>
                <TextField
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ width: '100%', marginBottom: '1.5625rem' }}
                    size="medium"
                    id="title"
                    label="Title"
                    multiline
                    maxRows={3}
                />
                <TextField
                    sx={{ width: '100%', marginBottom: '1.5625rem' }}
                    onChange={(e) => setDescription(e.target.value)}
                    size="medium"
                    id="description"
                    label="Description"
                    multiline
                    maxRows={7}
                />
                <TagsList tags={tags} setTags={setTags} />
                <Button variant="contained" onClick={handleCreatePost}>
                    Create
                </Button>
            </Box>
        </>
    );
};

const stateProps = (state) => {
    return {
        errors: state.wall.errors,
    };
};

const actionCreators = (dispatch) => {
    return {
        addPost: (data) => {
            return wallAC.AddPost(dispatch, data);
        },
    };
};

export default connect(stateProps, actionCreators)(NewPost);
