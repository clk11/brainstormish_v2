import customAxios from '../../../server/utils/customAxios';
import {
	register,
	registerFailed,
	loginFailed,
	login,
	changeClient,
	getUser,
	getUserFailed,
	sendConfirmationMail,
	sendConfirmationMailFailed,
	validateCredentials,
	validateCredentialsFailed,
	verifyMailId,
	verifyMailIdFailed
} from './auth-slice';

export const GetUser = async (dispatch) => {
	try {
		const res = await customAxios.get('/auth');
		dispatch(getUser(res.data));
		return 1;
	} catch (error) {
		dispatch(getUserFailed(error.response.data.err));
		window.location.reload(true);
		return 0;
	}
};

export const ChangeClient = (dispatch) => {
	return () => {
		dispatch(changeClient());
	};
};

export const ValidateCredentials = async (dispatch, user) => {
	try {
		const queryParams = Object.keys(user)
			.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(user[key])}`)
			.join('&');
		const url = `/auth/validate_credentials?${queryParams}`;
		await customAxios.get(url);
		dispatch(validateCredentials());
		return 1;
	} catch (error) {
		dispatch(validateCredentialsFailed(error.response.data.err));
		return 0;
	}
};

export const Register = async (dispatch, user) => {
	try {
		await customAxios.post('/auth/register', user);
		dispatch(register());
		return 1;
	} catch (error) {
		dispatch(registerFailed(error.response.data.err));
		return 0;
	}
}


export const Login = async (dispatch, user) => {
	try {
		await customAxios.post('/auth', user);
		dispatch(login());
		window.location.href = `/wall/${user.username}/posts/joined`;
		return 1;
	} catch (error) {
		dispatch(loginFailed(error.response.data.err));
		return 0;
	}
};

export const SendConfirmationMail = async (dispatch, data) => {
	try {
		await customAxios.post('/mail/send-mail', data);
		dispatch(sendConfirmationMail());
		return 1;
	} catch (error) {
		dispatch(sendConfirmationMailFailed(error.response.data.err))
		return 0;
	}
}

export const VerifyMailId = async (dispatch, data) => {
	try {
		const queryParams = Object.keys(data)
			.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
			.join('&');
		const url = `/mail/verify-id?${queryParams}`;
		await customAxios.get(url);
		dispatch(verifyMailId());
		return 1;
	} catch (error) {
		dispatch(verifyMailIdFailed(error.response.data.err));
		return 0;
	}
}
