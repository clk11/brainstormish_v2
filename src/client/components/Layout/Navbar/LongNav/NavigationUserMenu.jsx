import { IconButton, Menu, MenuItem } from '@mui/material';
import { DarkMode as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material';

const NavigationUserMenu = ({ anchorElUser, handleCloseUserMenu, logout, toggleMode, navigate }) => {
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
            <MenuItem onClick={() => navigate('/')}>
                Profile
            </MenuItem>
            <MenuItem onClick={() => navigate('/createPost')}
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
export default NavigationUserMenu;