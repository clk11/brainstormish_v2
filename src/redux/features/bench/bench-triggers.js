import customAxios from '../../../server/utils/customAxios';
import {
	getMembers, getMembersFailed, getMessages, getMessagesFailed, addMessage, addMessageFailed, getMembership, getMembershipFailed
} from './bench-slice';

export const GetMembership = async (dispatch, data) => {
	try {
		const queryParams = Object.keys(data)
			.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
			.join('&');

		const url = `/bench/membership/?${queryParams}`;
		const res = await customAxios.get(url);
		dispatch(getMembership(res.data))
		return 1;
	} catch (error) {
		dispatch(getMembersFailed(error.response.data.err))
		return 0;
	}
}

// export const GetMembers = async (dispatch, data) => {
// 	try {
// 		const queryParams = Object.keys(data)
// 			.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
// 			.join('&');

// 		const url = `/bench/members/?${queryParams}`;
// 		const res = await customAxios.get(url);
// 		dispatch(getMembers(res.data));
// 		return 1;
// 	} catch (error) {
// 		dispatch(getMembersFailed(error.response.data.err));
// 		// window.location.pathname = '/wall';
// 		//I NEED TO CREATE A PAGE THAT WILL POP OUT WHEN SOMETHING WRONG IS HAPPENING ******************
// 		return 0;
// 	}
// }

// export const GetMessages = async (dispatch, data) => {
// 	try {
// 		const queryParams = Object.keys(data)
// 			.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
// 			.join('&');

// 		const url = `/bench/messages/?${queryParams}`;
// 		const res = await customAxios.get(url);
// 		dispatch(getMessages(res.data));
// 		return 1;
// 	} catch (error) {
// 		dispatch(getMessagesFailed(error.response.data.err));
// 		// window.location.pathname = '/wall';
// 		//I NEED TO CREATE A PAGE THAT WILL POP OUT WHEN SOMETHING WRONG IS HAPPENING ******************
// 		return 0;
// 	}
// }

export const AddMessage = async (dispatch, data) => {
	try {
		await customAxios.post(`/bench/addMessage`, data);
		dispatch(addMessage());
		return 1;
	} catch (error) {
		dispatch(addMessageFailed(error.response.data.err));
		alert("You need to add a message !");
		return 0;
	}
}
