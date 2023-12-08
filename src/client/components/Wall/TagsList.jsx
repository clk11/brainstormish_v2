import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import { TransitionGroup } from 'react-transition-group';

//secondaryAction - what should be displayed at the end of the ListItem
const displayItem = ({ item, removeItem }) => {
	return (
        <ListItem
			secondaryAction={
				<IconButton
                    edge='end'
                    aria-label='delete'
                    title='Delete'
                    onClick={() => removeItem(item)}
                    size="large">
					<DeleteIcon />
				</IconButton>
			}
		>
			<ListItemText primary={item} />
		</ListItem>
    );
};

const Tags = ({ setTags, tags }) => {
	const [tag, setTag] = useState('');
	const [isBackSpace, setIsBackSpace] = useState(false);
	const handleKeyDown = (event) => {
		if (event.key === ' ' && event.key !== '-') {
			event.preventDefault();
			if (tag.charAt(tag.length - 1) !== '-') {
				setTag((prev) => {
					const newTag = prev.concat('-');
					document.getElementById('input').value = newTag;
					return newTag;
				});
			} else event.preventDefault();
		} else if (event.key === 'Backspace')
			setIsBackSpace(true);
	};

	const onTagChange = (e) => {
		if (isBackSpace) {
			setTag(e.target.value);
		} else {
			if (e.target.value.charAt(e.target.value.length - 1) !== '-')
				setTag(e.target.value);
			else
				document.getElementById('input').value = tag;
		}
	}

	const addItem = () => {
		if (tag.trim().length !== 0) {
			const cleanedTag = tag.endsWith('-') ? tag.slice(0, -1) : tag;
			if (tags.indexOf(tag) === -1) {
				setTags(() => {
					let newArr = [...tags]
					newArr.push(cleanedTag.toLowerCase());
					return newArr;
				});
				setTag('');
				document.getElementById('input').value = '';
			} else alert('Tag already in the list !')
		} else alert('You need to add a tag first !');
	};

	const removeItem = (item) => {
		setTags(() => {
			let temp = [...tags.filter((i) => i !== item)];
			return temp;
		});
	};

	const clearAllButton = (
		<Button
			variant='contained'
			color='error'
			onClick={() => {
				setTags(() => {
					let temp = [...tags];
					temp = [];
					return temp;
				});
			}}
		>
			CLEAR
		</Button>
	);

	const addItemButton = (
		<Button variant='contained' onClick={addItem}>
			ADD
		</Button>
	);

	return (
		<Grid container spacing={0.7} sx={{ marginBottom: '25px' }}>
			<Grid item>
				<TextField
					onKeyDown={handleKeyDown}
					onChange={onTagChange}
					size='small'
					id='input'
					required
					label='Introduce a tag'
				/>
			</Grid>
			<Grid item>{addItemButton}</Grid>
			<Grid item>{clearAllButton}</Grid>
			<Grid item>
				<List
					sx={{
						width: '100%',
						maxWidth: 'auto',
						bgcolor: 'background.paper',
						position: 'relative',
						overflow: 'auto',
						maxHeight: 130,
					}}
				>
					<TransitionGroup>
						{tags.map((item) => (
							<Collapse key={item}>
								{displayItem({ item, removeItem })}
							</Collapse>
						))}
					</TransitionGroup>
				</List>
			</Grid>
		</Grid>
	);
};

export default Tags;
