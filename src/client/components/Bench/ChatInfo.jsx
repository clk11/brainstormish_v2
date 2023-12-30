import React, { useEffect } from 'react'
import { Typography, Modal, List, ListItem, Grid, Box } from '@mui/material';
import Chip from '@mui/material/Chip';

const commonStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    overflow: 'auto',
};

const style1 = {
    ...commonStyle,
    padding: 5,
    width: '21.875rem',
    height: '15.625rem',
};

const style2 = {
    ...commonStyle,
    wordWrap: 'break-word',
    width: '21.875rem',
    height: 'auto',
    padding: 2.5,
    maxHeight: '25rem',
    overflowY: 'auto',
};

const ChatInfo = ({ users, info, open, setOpen, navigate, type }) => {
    function formatName(str) {
        if (str.length > 10)
            return str.slice(0, 10) + '...';
        return str;
    }
    return (
        <>
            <Modal
                open={open}
                onClose={() => { setOpen(false) }}
            >
                {type ? (
                    <>
                        <Box sx={style1}>
                            <Typography variant="h6" component="h2">
                                Chat participants
                            </Typography>
                            <List sx={{ height: 'auto', overflow: 'auto' }}>
                                {users.map(({ username, status }) => (
                                    <ListItem key={username} divider>
                                        <Grid container spacing={2}>
                                            <Grid item xs={9}>
                                                <Chip onClick={() => navigate(`/wall/profile/${username}`)} label={formatName(username)} />
                                            </Grid>
                                            <Grid item xs={3}>
                                                {status == 1 && (
                                                    <Typography color={'#00e676'}>online</Typography>
                                                )}
                                                {status == 0 && (
                                                    <Typography color={'red'}>offline</Typography>

                                                )}
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </>
                ) : (
                    <Box sx={style2}>
                        <h3>Title</h3>
                        <p>{info.title}</p>
                        <h3>Description</h3>
                        <p>
                            {info.description}
                        </p>
                    </Box>
                )}
            </Modal>
        </>
    )
}

export default ChatInfo
