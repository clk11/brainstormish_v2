import React, { useState, useEffect } from 'react';
import Post from './Post';
import { connect } from 'react-redux';
import { wallAC } from '../../../redux/features';
import ProgressBar from '../Layout/ProgressBar';
import { useNavigate } from 'react-router-dom';
import { Container, Grid } from '@mui/material';
import PaginatedList from './PaginatedList';
const Wall = ({ getPosts, posts, joinDiscussion, change, start, setStart, searchInput, setSearchInput }) => {
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [filteredPosts, setFilteredPosts] = useState([]);

	useEffect(() => {
		console.log('loading the posts');
		const fetchData = async () => {
			const result = await getPosts(get_order());
			if (result === 1) {
				setLoading(false);
				setFilteredPosts([]);
			}
		}
		fetchData();
	}, [change]);

	useEffect(() => {
		const exec = () => {
			onSearch();
			setStart(false);
		}
		if (start === true) exec();
	}, [start])

	const str_tags = (str) => {
		const splited_str = str.split(' ').map(x => x.toLowerCase()).filter(x => x.length > 0);
		return splited_str;
	}

	const count_hits = (str, arr) => {
		let score = 0;
		for (let i = 0; i < arr.length; i++) {
			const element = arr[i];
			if (element.includes(str)) score++;
		}
		return score;
	}

	const filterPosts = () => {
		let filtered_posts = [];
		let scores = [];
		const input_tags = str_tags(searchInput);
		for (let i = 0; i < posts.length; i++) {
			let score = 0;
			const post = posts[i];
			const title_tags = str_tags(post.title);
			const description_tags = str_tags(post.description);
			for (let j = 0; j < input_tags.length; j++) {
				const input_tag = input_tags[j];
				score += count_hits(input_tag, title_tags);
				score += count_hits(input_tag, description_tags);
				score += count_hits(input_tag, post.tags);
			}
			scores.push({ post, score });
		}
		//
		filtered_posts = scores.sort((a, b) => b.score - a.score).map(x => x.post);
		return filtered_posts;
	}

	const onSearch = () => {
		setPage(1);
		setFilteredPosts([]);
		if (searchInput.trim().length !== 0) {
			const filtered_posts = filterPosts();
			setFilteredPosts(filtered_posts);
			setSearchInput('')
		}
	}

	function get_order() {
		let data = {
			type: '',
			username: window.location.pathname.split('/')[2],
		};
		const url = window.location.href;
		const correct_address = import.meta.env.VITE_FN_URL;
		const pattern_joined = new RegExp(`^${correct_address}wall/[^/]+/posts/joined$`);
		const pattern_created = new RegExp(`^${correct_address}wall/[^/]+/posts$`);
		const pattern_unjoined = correct_address + 'wall';
		if (pattern_unjoined === url) data.type = 0;
		else {
			if (pattern_joined.test(url)) data.type = 1;
			else if (pattern_created.test(url)) data.type = 2;
		}
		return data;
	}

	const postComponent = (post, key) => (
		<Grid item key={key}>
			<Post join={joinDiscussion} post={post} navigate={navigate} />
		</Grid>
	);

	const displayPosts = (_posts) => {
		if (posts.length !== 0)
			return <PaginatedList setPage={setPage} page={page} data={_posts.map((post, key) => postComponent(post, key))} />
		else {
			const containerStyle = {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			};

			const imageStyle = {
				maxWidth: '50%',
				height: 'auto',
			};
			return (
				<div style={containerStyle}>
					<img src="/noposts.png" alt="Image not available" style={imageStyle} />
				</div>
			);
		}
	};
	return (
		<>
			<Container>
				{loading && <ProgressBar />}
				{!loading && (
					<Grid
						spacing={4}
						container
						direction='column'
						justifyContent='center'
						alignItems='center'
					>
						<Grid item>
							{filteredPosts.length === 0 ? displayPosts(posts) : displayPosts(filteredPosts)}
						</Grid>
					</Grid>
				)}
			</Container>
		</>
	);
};

const stateProps = (state) => {
	return {
		posts: state.wall.posts,
	};
};

const actionCreators = (dispatch) => {
	return {
		getPosts: (data) => {
			return wallAC.GetPosts(dispatch, data);
		},
		joinDiscussion: (data, navigate) => {
			return wallAC.JoinDiscussion(dispatch, data, navigate);
		}
	};
};
export default connect(stateProps, actionCreators)(Wall);
