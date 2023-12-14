import React, { Fragment, useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import customAxios from '../server/utils/customAxios';
import ProgressBar from './components/Layout/ProgressBar';
const Auth = lazy(() => import('./components/Auth/Auth'));
const NewPost = lazy(() => import('./components/Wall/NewPost'));
const Navbar = lazy(() => import('./components/Layout/Navbar/Navbar'));
const Profile = lazy(() => import('./components/Profile/Profile'));
const Wall = lazy(() => import('./components/Wall/Wall'));
const Chat = lazy(() => import('./components/Bench/Chat'));

const App = () => {
	const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('mode') === 'dark');
	const [isAuth, setIsAuth] = useState(null);
	const [change, setChange] = useState(null);
	const [theme, setTheme] = useState(() => createTheme({
		palette: {
			mode: isDarkMode ? 'dark' : 'light',
		},
	}));

	useEffect(() => {
		const fetch = async () => {
			try {
				await customAxios.get('/auth/session');
				setIsAuth(true);
			} catch (error) {
				setIsAuth(false);
			}
		}
		fetch();
	}, []);

	useEffect(() => {
		localStorage.setItem('mode', isDarkMode ? 'dark' : 'light');
		setTheme(createTheme({
			palette: {
				mode: isDarkMode ? 'dark' : 'light',
			},
		}));
	}, [isDarkMode]);

	const toggleMode = () => setIsDarkMode(!isDarkMode);

	return (
		<Router>
			{theme && isAuth !== null ? (
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Suspense fallback={<ProgressBar />}>
						{isAuth ? (
							<Fragment>
								<Navbar setChange={setChange} toggleMode={toggleMode} />
								<div className='row'>
									<Routes>
										<Route path='/' element={<Profile />} />
										<Route path='/wall/profile/:user' element={<Profile change={change} />} />
										<Route path='/wall' element={<Wall change={change} />} />
										<Route path='/wall/:user/posts' element={<Wall change={change} />} />
										<Route path='/wall/:user/posts/joined' element={<Wall change={change} />} />
										<Route path='/createPost' element={<NewPost />} />
										<Route path='/bench/:title/:postid' element={<Chat />} />
									</Routes>
								</div>
							</Fragment>
						) : (
							<Routes>
								<Route path='/' element={<Auth />} />
							</Routes>
						)}
					</Suspense>
				</ThemeProvider>
			) : (
				<ProgressBar />
			)}
		</Router>
	);
};

export default App;
