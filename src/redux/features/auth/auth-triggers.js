import customAxios from '../../../server/utils/customAxios';
import {
	register,
	registerFailed,
	loginFailed,
	login,
	changeClient,
	getUser,
	getUserFailed,
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

export const Register = async (dispatch, user) => {
	try {
		await customAxios.post('/auth/register', user);
		dispatch(register());
		return 1;
	} catch (error) {
		dispatch(registerFailed(error.response.data.err));
		return 0;
	}
};

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
