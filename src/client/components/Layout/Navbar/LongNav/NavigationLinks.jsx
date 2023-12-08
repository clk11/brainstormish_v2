import { Menu, Button, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NavigationLinks = ({ anchorElNav, handleCloseNavMenu, user, setChange }) => {
    const navigate = useNavigate();
    const toWall = () => {
        navigate('/wall');
        setChange('/wall');
    }
    const toJoined = () => {
        navigate(`/wall/${user.username}/posts/joined`);
        setChange(`/wall/${user.username}/posts/joined`);
    }
    const toCreated = () => {
        navigate(`/wall/${user.username}/posts`);
        setChange(`/wall/${user.username}/posts`);
    }
    return (
        <>
            {anchorElNav === undefined ? (
                <>
                    <Button
                        sx={{ my: 2, color: 'white', display: 'block' }}
                        onClick={toWall}
                    >
                        {'Wall'}
                    </Button>
                    <Button
                        sx={{ my: 2, color: 'white', display: 'block' }}
                        onClick={toJoined}
                    >
                        Joined
                    </Button>
                    <Button
                        sx={{ my: 2, color: 'white', display: 'block' }}
                        onClick={toCreated}
                    >
                        {'Created'}
                    </Button>
                </>
            ) : (
                <>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                        }}
                    >
                        <MenuItem onClick={toWall}>
                            Wall
                        </MenuItem>
                        <MenuItem onClick={toJoined}>
                            Joined
                        </MenuItem>
                        <MenuItem onClick={toCreated}>
                            Created
                        </MenuItem>
                    </Menu>
                </>
            )}
        </>
    )
}

export default NavigationLinks;