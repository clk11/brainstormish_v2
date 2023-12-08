import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	errors: null,
	members: null,
	messages: null,
	username: null,
	membership: null,
};

const benchSlice = createSlice({
	name: 'bench',
	initialState,
	reducers: {
		getMembers(state, action) {
			state.errors = null;
			state.members = action.payload;
		},
		getMembersFailed(state, action) {
			state.members = null;
			state.errors = action.payload;
		},
		getMessages(state, action) {
			state.errors = null;
			state.messages = action.payload.messages;
			state.username = action.payload.username;
		},
		getMessagesFailed(state, action) {
			state.messages = null;
			state.username = null;
			state.errors = action.payload;
		},
		addMessage(state) {
			state.errors = null;
		},
		addMessageFailed(state, action) {
			state.errors = action.payload;
		},
		getMembership(state, action) {
			state.membership = action.payload;
			state.errors = null;
		},
		getMembershipFailed(state, action) {
			state.errors = action.payload;
			state.membership = null;
		}
	},
});

export const {
	getMembers, getMembersFailed, getMessages, getMessagesFailed, addMessage, addMessageFailed, getMembership, getMembershipFailed
} = benchSlice.actions;
export default benchSlice.reducer;
