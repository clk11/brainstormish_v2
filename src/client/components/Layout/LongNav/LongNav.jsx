import * as React from 'react';
import { styled, alpha, AppBar, Toolbar, Typography, InputBase, Avatar } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const LongNav = ({ setChange, toggleMode, setStart, setSearchInput, user }) => {
    // const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const [input, setInput] = React.useState('');
    const onSearch = () => {
        if (input.trim().length !== 0) {
            if (!window.location.href.includes('/wall')) {
                navigate('/wall');
                setChange('/wall');
            }
            setSearchInput(input);
            setStart(true);
            setInput('');
        }
    }
    return (
        <AppBar sx={{ marginBottom: '20px', position: 'sticky', top: 0, zIndex: 1 }} position="static">
            <Toolbar>
                <Avatar
                    onClick={() => { navigate(`/wall/${user.username}/posts`); setChange(`/wall/${user.username}/posts`) }}
                    src={'/icon.png'}
                    sx={{ width: '5rem', height: '5rem', margin: 'auto' }}
                />
                <Navbar setChange={setChange} toggleMode={toggleMode} />
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ textAlign: 'center', flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                >
                    {/* the title would be here */}
                </Typography>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        id='input'
                        value={input}
                        onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Search…"
                    />
                </Search>
            </Toolbar>
        </AppBar>
    );
}
const stateProps = (state) => {
    return {
        user: state.auth.user,
    };
};

export default connect(stateProps)(LongNav);