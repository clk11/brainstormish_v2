import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import { red } from '@mui/material/colors';
import { CardContent, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

const Post = ({ post, join, navigate }) => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const { id, title, description, date, username, tags } = post;
	const displayTag = (tag, key) => (
		<Grid item key={key}>
			<Chip variant='outlined' color='primary' label={tag} />
		</Grid>
	);

	const seeProfile = () => {
		navigate(`/wall/profile/${username}`);
	};

	const handlePopoverOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};
	const onJoin = async () => {
		if (!(post.status === 0 ? false : true))
			await join({ admin_username: username, id_post: id, path: `/bench/${id}`, info: { title, description } }, navigate);
		else {
			navigate(`/bench/${id}`, { state: { title, description } });
		}
	};

	const formatTitle = (str) => {
		if (str.length > 38)
			return str.slice(0, 30) + '...';
		return str;
	}
	return (
		<Card sx={{ maxWidth: 400 }}>
			<Grid container>
				<CardHeader
					avatar={
						<Avatar
							onMouseEnter={handlePopoverOpen}
							onMouseLeave={handlePopoverClose}
							onClick={seeProfile}
							sx={{ bgcolor: red[500], cursor: 'pointer' }}
							aria-label='recipe'
						>
							{username.substr(0, 3).toUpperCase()}
						</Avatar>
					}
					title={formatTitle(title)}
					subheader={date}
				/>
				<Popover
					sx={{
						pointerEvents: 'none',
					}}
					open={anchorEl === null ? false : true}
					anchorEl={anchorEl}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'left',
					}}
					onClose={handlePopoverClose}
					disableRestoreFocus
				>
					<Typography sx={{ p: 1 }}>Show the profile</Typography>
				</Popover>
				<CardContent>
					<Grid container spacing={3}>
						<Grid item container spacing={1}>
							{tags.map((tag, key) => displayTag(tag, key))}
						</Grid>
						<Grid item container direction={'row'} spacing={1}>
							<Grid item>
								<Button onClick={onJoin} variant='contained' color='success'>
									{(post.status === 0 ? false : true) ? 'View' : 'Join'}
								</Button>
							</Grid>
							<Grid item container xs={3}>
								<Grid item>
									<IconButton onClick={handleOpen} aria-label='Show the picture' size="large">
										<DescriptionIcon fontSize={'medium'} />
									</IconButton>
									<Modal
										open={open}
										onClose={handleClose}
										aria-labelledby='modal-modal-title'
										aria-describedby='modal-modal-description'
									>
										<Box sx={style}>
											<label>Title</label>
											<Typography
												sx={{ mt: 0.5 }}
												id='modal-modal-title'
											>
												{title}
											</Typography>
											<br />
											<label>Description</label>
											<Typography id='modal-modal-description' sx={{ mt: 0.5 }}>
												{description}
											</Typography>
										</Box>
									</Modal>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
			</Grid>
		</Card>
	);
};

export default Post;
