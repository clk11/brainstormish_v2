import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import ProgressBar from '../Layout/ProgressBar';
import { Grid } from '@mui/material';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authAC, wallAC } from '../../../redux/features/';

const Profile = ({ getUser, user }) => {
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
	}, []);

	return (
		<div style={{ fontSize: '130%' }}>
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
							<h2>{user.username}</h2>
							<h5>{user.email}</h5>
							<h5>I became cool on {user.date}</h5>
						</Grid>
						<Grid item container justifyContent='center' spacing={2}>
							{my && (
								<Grid item>
									<Button
										variant='contained'
										onClick={() => navigate('/createPost')}
									>
										Make a post
									</Button>
								</Grid>
							)}
							<Grid item>
								<Button
									onClick={() => navigate(`/wall/${user.username}/posts`)}
									variant='contained'
									color='primary'
								>
									{!my ? 'Discussions' : 'My discussions'}
								</Button>
							</Grid>
						</Grid>
						{my && (
							<Grid item container justifyContent='center' spacing={2}>
								<Grid item>
									<Button
										variant='contained'
										color='secondary'
										onClick={() =>
											navigate(`/wall/${user.username}/posts/joined`)
										}
									>
										Joined discussions
									</Button>
								</Grid>
								<Grid item>
									<Button
										variant='contained'
										color='secondary'
										onClick={() => navigate('/wall')}
									>
										Unjoined discussions
									</Button>
								</Grid>
							</Grid>
						)}
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
