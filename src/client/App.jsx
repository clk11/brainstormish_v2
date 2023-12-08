import React, { Fragment, useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import customAxios from '../server/utils/customAxios';
import ProgressBar from './components/Layout/ProgressBar';
import SecondNavbar from './components/Layout/Navbar/SecondNavbar';
const Auth = lazy(() => import('./components/Auth/Auth'));
const NewPost = lazy(() => import('./components/Wall/NewPost'));
const Navbar = lazy(() => import('./components/Layout/Navbar/Navbar'));
const Profile = lazy(() => import('./components/Profile/Profile'));
const Wall = lazy(() => import('./components/Wall/Wall'));
const Chat = lazy(() => import('./components/Bench/Chat'));

const App = () => {
	const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('mode') === 'dark');
	const [isAuth, setIsAuth] = useState(null);
	const [navbar, setNavbar] = useState(true);
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
								{navbar === false ? (
									<Navbar toggleMode={toggleMode} />
								) : (
									<SecondNavbar toggleMode={toggleMode} />
								)}
								<div className='row'>
									<Routes>
										<Route path='/' element={<Profile />} />
										<Route path='/wall/profile/:user' element={<Profile />} />
										<Route path='/wall' element={<Wall />} />
										<Route path='/wall/:user/posts' element={<Wall />} />
										<Route path='/wall/:user/posts/joined' element={<Wall />} />
										<Route path='/createPost' element={<NewPost />} />
										<Route path='/bench/:postid' element={<Chat setNavbar={setNavbar} />} />
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
