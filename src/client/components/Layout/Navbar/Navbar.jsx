import { useState, React } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, Box, IconButton, Modal, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import customAxios from '../../../../server/utils/customAxios';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '1.2px solid #000',
	boxShadow: 30,
	pt: 2,
	px: 4,
	pb: 3,
};

const MenuOptions = ({ toggleMode, setOpen, open, navigate }) => {
	const onClick = async () => {
		await customAxios.get('/auth/clear_session');
		navigate('/');
		window.location.reload();
	};
	return (
		<List
			sx={{
				width: '100%',
				maxWidth: 360,
				bgcolor: 'background.paper',
			}}
		>
			<ListItem>
				<Button onClick={() => { navigate('/'); setOpen(!open); }}>
					Profile
				</Button>
			</ListItem>
			<ListItem>
				<Button onClick={onClick}>
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
	);
};

const Navbar = ({ toggleMode }) => {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	return (
		<div style={{ position: 'sticky', top: 0 }}>
			<IconButton
				onClick={() => {
					setOpen(true);
				}}
				color='secondary'
				size='large'
			>
				<MenuIcon fontSize='inherit' />
			</IconButton>
			<Modal
				open={open}
				onClose={() => {
					setOpen(false);
				}}
			>
				<Box sx={{ ...style, width: 'auto' }}>
					<MenuOptions toggleMode={toggleMode} setOpen={setOpen} open={open} navigate={navigate} />
				</Box>
			</Modal>
		</div>
	);
};

export default Navbar;
