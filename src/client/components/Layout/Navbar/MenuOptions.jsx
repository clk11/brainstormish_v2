import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import customAxios from '../../../../server/utils/customAxios.js'
import { List, ListItem, Grid, IconButton, Button } from '@mui/material';

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
            spacing={1.5}
        >
            <Grid item>
                <Button onClick={toProfile}>
                    Profile
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={toCreate}>
                    Create post
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={toWall}>
                    Unjoined posts
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={toJoined}>
                    Joined posts
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={toCreated}>
                    Created posts
                </Button>
            </Grid>
            <Grid item>
                <Button onClick={logout}>
                    Log out
                </Button>
            </Grid>
            <Grid item>
                <IconButton
                    variant="contained"
                    onClick={() => {
                        toggleMode();
                    }}
                    size="large"
                >
                    {localStorage.getItem('mode') === 'light' && (
                        <DarkModeIcon />
                    )}
                    {localStorage.getItem('mode') === 'dark' && (
                        <LightModeIcon />
                    )}
                </IconButton>
            </Grid>
        </Grid>
    );
};

export default MenuOptions;