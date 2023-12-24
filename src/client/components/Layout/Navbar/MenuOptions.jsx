import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import customAxios from '../../../../server/utils/customAxios.js';
import { Grid, IconButton, Button, Avatar, Typography, Divider } from '@mui/material';

const MenuOptions = ({ setOpen, user, setChange, navigate, toggleMode }) => {
    const logout = async () => {
        await customAxios.get('/auth/clear_session');
        navigate('/');
        window.location.reload();
    };

    const toWall = () => {
        navigate('/wall');
        setChange('/wall');
        setOpen(false);
    }
    const toJoined = () => {
        navigate(`/wall/${user.username}/posts/joined`);
        setChange(`/wall/${user.username}/posts/joined`);
        setOpen(false);
    }
    const toCreated = () => {
        navigate(`/wall/${user.username}/posts`);
        setChange(`/wall/${user.username}/posts`);
        setOpen(false);
    }
    const toCreate = () => {
        navigate('/createPost');
        setOpen(false);
    }
    const toProfile = () => {
        navigate('/');
        setOpen(false);
    }

    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
        >
            <Grid item>
                <Button onClick={toProfile} style={{color:'grey'}}>
                    <Avatar src={user.profileImage} alt={user.username} sx={{ marginRight: '0.5rem' }} />
                    <Typography variant="h6">{user.username}</Typography>
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={toCreate}>
                    Create Post
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={toWall}>
                    Unjoined Posts
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={toJoined}>
                    Joined Posts
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={toCreated}>
                    Created Posts
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={logout} color="secondary">
                    Log out
                </Button>
            </Grid>
            <Grid item>
                <IconButton
                    onClick={() => {
                        toggleMode();
                    }}
                    size="large"
                >
                    {localStorage.getItem('mode') === 'light' ? (
                        <DarkModeIcon />
                    ) : (
                        <LightModeIcon />
                    )}
                </IconButton>
            </Grid>
        </Grid>
    );
};

export default MenuOptions;
