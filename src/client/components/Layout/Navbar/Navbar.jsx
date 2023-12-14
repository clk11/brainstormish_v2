import { useState, React, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Modal } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { connect } from 'react-redux';
import { authAC } from '../../../../redux/features';
import MenuOptions from './MenuOptions';
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

const Navbar = ({ toggleMode, getUser, setChange, user }) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const fetch = async () => {
			const result = await getUser();
			if (result === 1) setLoading(false);
		}
		if (getUser)
			fetch();
	}, []);

	return (
		<>
			{!loading && (
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
							<MenuOptions
								setChange={setChange}
								getUser={getUser}
								user={user}
								toggleMode={toggleMode}
								setOpen={setOpen}
								navigate={navigate} />
						</Box>
					</Modal>
				</div>
			)}
		</>
	);
};

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