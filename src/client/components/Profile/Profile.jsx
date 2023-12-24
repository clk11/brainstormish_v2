import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import ProgressBar from '../Layout/ProgressBar';
import { Grid, Avatar, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authAC, wallAC } from '../../../redux/features/';

const Profile = ({ getUser, user, change }) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [my, setMy] = useState(true);

	useEffect(() => {
		let isMounted = true;
		const fetchData = async () => {
			let result;
			if (window.location.href === import.meta.env.VITE_FN_URL) {
				result = await getUser(null);
				setMy(true);
			} else {
				result = await getUser(window.location.pathname.split('/')[3]);
				setMy(false);
			}
			if (result === 1 && isMounted) setLoading(false);
		};

		fetchData();

		return () => {
			isMounted = false;
		};
	}, [change]);

	return (
		<div style={{ fontSize: '1.3rem' }}>
			{loading && <ProgressBar />}
			{!loading && (
				<div>
					<Grid
						container
						spacing={2}
						direction='column'
						justifyContent='center'
						alignItems='center'
					>
						<Grid item>
							<Avatar
								src={'/icon.png'}
								alt={user.username}
								sx={{ width: '15rem', height: '15rem', margin: 'auto' }}
							/>
						</Grid>
						<Grid item sx={{ textAlign: 'center' }}>
							<Typography variant="h4" sx={{ fontSize: '2.5rem', margin: '1rem', marginTop: 0 }}>
								{user.username}
							</Typography>
							<Typography variant="subtitle1" sx={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>
								{user.email}
							</Typography>
							<Typography variant="subtitle2" sx={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>
								I became cool on {user.date}
							</Typography>
						</Grid>
						<Grid item container justifyContent='center' spacing={2}>
							<Grid item>
								{!my && (
									<Button
										onClick={() => navigate(`/wall/${user.username}/posts`)}
										variant='contained'
										color='primary'
									>
										{'Discussions'}
									</Button>
								)}
							</Grid>
						</Grid>
					</Grid>
				</div>
			)}
		</div>
	);
};

const stateProps = (state) => {
	if (window.location.href === import.meta.env.VITE_FN_URL) {
		return {
			user: state.auth.user,
		};
	} else {
		return {
			user: state.wall.user,
		};
	}
};

const actionCreators = (dispatch) => {
	return {
		getUser: (data) => {
			if (data === null) return authAC.GetUser(dispatch);
			else return wallAC.GetUser(dispatch, data);
		},
	};
};

export default connect(stateProps, actionCreators)(Profile);
