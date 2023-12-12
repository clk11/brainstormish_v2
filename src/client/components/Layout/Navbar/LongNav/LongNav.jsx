import { useState, useEffect } from 'react';
import NavigationLinks from './NavigationLinks.jsx';
import NavigationUserMenu from './NavigationUserMenu.jsx';
import { AppBar, Box, Toolbar, IconButton, Typography, Container, Avatar } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { authAC } from '../../../../../redux/features/';
import Progress from '../../ProgressBar';
import customAxios from '../../../../../server/utils/customAxios'


const Navbar = ({ toggleMode, getUser, user, setChange }) => {
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
        <AppBar sx={{ marginBottom: '20px', position: 'sticky', top: 0, zIndex: 1 }} position="static">
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
                            <NavigationLinks navigate={navigate} setChange={setChange} user={user} anchorElNav={anchorElNav} handleCloseNavMenu={handleCloseNavMenu} />
                        </Box>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <NavigationLinks setChange={setChange} user={user} navigate={navigate} />
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <Avatar
                                sx={{ bgcolor: 'grey', cursor: 'pointer' }}
                                aria-label='recipe'
                                onClick={handleOpenUserMenu}
                            >
                                {formatUsername(user.username)}
                            </Avatar>
                            <NavigationUserMenu navigate={navigate} toggleMode={toggleMode} anchorElUser={anchorElUser} handleCloseUserMenu={handleCloseUserMenu} logout={logout} />
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

export default connect(stateProps, actionCreators)(Navbar);