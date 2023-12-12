import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	clientLogin: true,
	user: null,
	errors: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		changeClient(state) {
			state.clientLogin = !state.clientLogin;
		},
		register(state) {
			state.errors = null;
		},
		registerFailed(state, action) {
			state.errors = action.payload;
		},
		getUser(state, action) {
			state.errors = null;
			state.user = action.payload;
		},
		getUserFailed(state, action) {
			state.user = null;
			state.errors = action.payload;
		},
		login(state) {
			state.errors = null;
		},
		loginFailed(state, action) {
			state.errors = action.payload;
			state.user = null;
		},
		sendConfirmationMail(state) {
			state.errors = null;
		},
		sendConfirmationMailFailed(state, action) {
			state.errors = action.payload;
		},
		verifyMailId(state) {
			state.errors = null;
		},
		verifyMailIdFailed(state, action) {
			state.errors = action.payload;
		},
		validateCredentials(state) {
			state.errors = null;
		},
		validateCredentialsFailed(state, action) {
			state.errors = action.payload;
		}

	},
});

export const {
	changeClient,
	register,
	registerFailed,
	login,
	loginFailed,
	getUser,
	getUserFailed,
	sendConfirmationMail,
	sendConfirmationMailFailed,
	verifyMailId,
	verifyMailIdFailed,
	validateCredentials,
	validateCredentialsFailed
} = authSlice.actions;
export default authSlice.reducer;
