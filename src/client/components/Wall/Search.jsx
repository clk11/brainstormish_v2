import { useState } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const Search = ({ posts, setFilteredPosts }) => {
	const [input, setInput] = useState('');

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
		const input_tags = str_tags(input);
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

	const onSearchClick = (e) => {
		e.preventDefault();
		setFilteredPosts([]);
		if (input.length !== 0) {
			const filtered_posts = filterPosts();
			setFilteredPosts(filtered_posts);
		}
	}
	return (
		<Paper
			component='form'
			sx={{ display: 'flex', alignItems: 'center', width: '20rem' }}
		>
			<InputBase
				sx={{ ml: 1, flex: 1, textDecoration: 'none' }}
				placeholder='Wanna discuss something ?'
				onChange={(e) => setInput(e.target.value)}
			/>
			<IconButton
				onClick={onSearchClick}
				type='submit'
				sx={{ p: '10px' }}
				aria-label='search'
				size="large">
				<SearchIcon />
			</IconButton>
		</Paper>
	);
};

export default Search;
