import { useState, useEffect } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, MenuItem } from '@mui/material';
import { Menu as MenuIcon, DarkMode as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { authAC } from '../../../../redux/features/';
import Progress from '../ProgressBar';
import customAxios from '../../../../server/utils/customAxios'
const Links = ({ anchorElNav, handleCloseNavMenu, user, setChange }) => {
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

const UserMenu = ({ anchorElUser, handleCloseUserMenu, logout, toggleMode, navigate }) => {
    return (
        <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
        >
            <MenuItem onClick={() => { navigate('/'); handleCloseUserMenu(); }}>
                Profile
            </MenuItem>
            <MenuItem onClick={() => { navigate('/createPost'); handleCloseUserMenu(); }}
            >
                Create post
            </MenuItem>
            <MenuItem onClick={logout}>
                Logout
            </MenuItem>
            <MenuItem>
                <IconButton
                    onClick={() => { toggleMode() }}
                    variant="contained"
                    size="large">
                    {localStorage.getItem('mode') === 'light' && (
                        <DarkModeIcon />
                    )}
                    {localStorage.getItem('mode') === 'dark' && (
                        <LightModeIcon />
                    )}
                </IconButton>
            </MenuItem>
        </Menu >
    )
}

const SecondNavbar = ({ toggleMode, getUser, user, setChange }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const result = await getUser();
            if (result === 1) setLoading(false);
        }
        if (getUser)
            fetch();
    }, []);

    const formatUsername = (str) => {
        if (str.length > 3)
            return str.slice(0, 3);
        return str;
    }

    const logout = async () => {
        await customAxios.get('/auth/clear_session');
        navigate('/');
        window.location.reload();
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar sx={{ marginBottom: '20px', position: 'sticky', top: 0 }} position="static">
            {!loading && (
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <img
                            type="image/png"
                            src="/icon.png"
                            alt="Logo"
                            style={{
                                display: { xs: 'none', md: 'flex' },
                                marginRight: 1,
                                height: '70px',
                                width: '70px',
                            }}
                        />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Links setChange={setChange} user={user} anchorElNav={anchorElNav} handleCloseNavMenu={handleCloseNavMenu} />
                        </Box>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Links setChange={setChange} user={user} navigate={navigate} />
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <Avatar
                                sx={{ bgcolor: 'grey', cursor: 'pointer' }}
                                aria-label='recipe'
                                onClick={handleOpenUserMenu}
                            >
                                {formatUsername(user.username)}
                            </Avatar>
                            <UserMenu navigate={navigate} toggleMode={toggleMode} anchorElUser={anchorElUser} handleCloseUserMenu={handleCloseUserMenu} logout={logout} />
                        </Box>
                    </Toolbar>
                </Container>
            )}
            {loading && (
                <Progress />
            )}
        </AppBar>
    );
}

const stateProps = (state) => {
    return {
        user: state.auth.user,
    };
};

const actionCreators = (dispatch) => {
    return {
        getUser: () => {
            return authAC.GetUser(dispatch);
        },
    };
};

export default connect(stateProps, actionCreators)(SecondNavbar);
