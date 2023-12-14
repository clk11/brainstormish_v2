import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import customAxios from '../../../../server/utils/customAxios.js'
import { List, ListItem, IconButton, Button } from '@mui/material';

const MenuOptions = ({ setOpen, open, user, setChange, navigate, toggleMode }) => {
    const logout = async () => {
        await customAxios.get('/auth/clear_session');
        navigate('/');
        window.location.reload();
    };

    const toWall = () => {
        navigate('/wall');
        setChange('/wall');
        setOpen(!open);
    }
    const toJoined = () => {
        navigate(`/wall/${user.username}/posts/joined`);
        setChange(`/wall/${user.username}/posts/joined`);
        setOpen(!open);
    }
    const toCreated = () => {
        navigate(`/wall/${user.username}/posts`);
        setChange(`/wall/${user.username}/posts`);
        setOpen(!open);
    }
    const toProfile = () => {
        navigate('/');
        setOpen(!open);
    }
    return (
        <>
            <List
                sx={{
                    width: '100%',
                    maxWidth: 360,
                    bgcolor: 'background.paper',
                }}
            >
                <ListItem>
                    <Button onClick={toProfile}>
                        Profile
                    </Button>
                </ListItem>
                <ListItem>
                    <Button onClick={toWall}>
                        Wall
                    </Button>
                </ListItem>
                <ListItem>
                    <Button onClick={toJoined}>
                        Joined
                    </Button>
                </ListItem>
                <ListItem>
                    <Button onClick={toCreated}>
                        Created
                    </Button>
                </ListItem>
                <ListItem>
                    <Button onClick={logout}>
                        Log out
                    </Button>
                </ListItem>
                <ListItem>
                    <IconButton
                        variant="contained"
                        onClick={() => {
                            toggleMode();
                        }}
                        size="large">
                        {localStorage.getItem('mode') === 'light' && (
                            <DarkModeIcon />
                        )}
                        {localStorage.getItem('mode') === 'dark' && (
                            <LightModeIcon />
                        )}
                    </IconButton>
                </ListItem>
            </List>
        </>
    );
};

export default MenuOptions;