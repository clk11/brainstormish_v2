import { Menu, Button, MenuItem } from '@mui/material';

const NavigationLinks = ({ anchorElNav, handleCloseNavMenu, user, setChange, navigate }) => {
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
                        Not joined
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
                        Created
                    </Button>
                </>
            ) : (
                <>
                    <Menu
                        anchorEl={anchorElNav}
                        id="menu-appbar"
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
                            Not joined
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