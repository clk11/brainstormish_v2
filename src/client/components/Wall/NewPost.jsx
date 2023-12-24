import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import TagsList from './TagsList';
import Button from '@mui/material/Button';
import { connect } from 'react-redux';
import { wallAC } from '../../../redux/features/';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import Snack from "../Layout/SnackBar/Snack";
import { useNavigate } from 'react-router-dom';

const NewPost = ({ addPost, errors }) => {
    const [boxShadow] = useState(localStorage.getItem('mode') === 'dark' ?
        "0 16px 24px 2px rgba(255, 255, 255, 0.1), 0 6px 30px 5px rgba(255, 255, 255, 0.08), 0 8px 10px -5px rgba(255, 255, 255, 0.15)" :
        "0 16px 24px 2px rgba(0, 0, 0, 0.3), 0 6px 30px 5px rgba(0, 0, 0, 0.25), 0 8px 10px -5px rgba(0, 0, 0, 0.3)"
    );
    //
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    //
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);

    const handleCreatePost = async () => {
        const res = await addPost({ title, description, tags });
        if (res === 1) {
            setAlertMessage('Post created successfully!');
            setOpen(true);
            setTimeout(() => {
                navigate('/');
            }, 500);
        } else setOpen(true);
    };
    return <>
        <Snack alertMessage={alertMessage} open={open} setOpen={setOpen} errors={errors} />
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            p={4}
            mx="auto"
            mt={4}
            borderRadius="6px"
            boxShadow={boxShadow}
            width="80%"
            maxWidth="800px"
        >
            <Typography variant="h3" gutterBottom>
                Add a New Post
            </Typography>
            <TextField
                onChange={(e) => setTitle(e.target.value)}
                sx={{ width: '100%', marginBottom: '25px' }}
                size="medium"
                id="title"
                label="Title"
                multiline
                maxRows={3}
            />
            <TextField
                sx={{ width: '100%', marginBottom: '25px' }}
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
    </>;
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
