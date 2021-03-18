import React, { useContext, useCallback, useState, useEffect } from 'react';
import './App.css';
import {
	BrowserRouter,
	Route,
	Router,
	Switch,
	Redirect
} from 'react-router-dom';
import Login from './components/Login/Login';
import Navbar from './components/shared/Navbar/Navbar';
import Notification from './components/shared/Notification/Notification';
import { AuthContext } from './context/AuthContext';
import { NotificationContext } from './context/NotificationContext';
import Homepage from './pages/Home/Homepage';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState();
	const [token, setToken] = useState();
	const [name, setName] = useState();
	const [role, setRole] = useState();
	const [userId, setUserId] = useState();
	const [user, setUser] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [notify, setNotify] = useState();
	const [message, setMessage] = useState();
	const [error, setError] = useState(false);

	const setNotification = useCallback((msg, error) => {
		setMessage(msg);
		setError(error);
		setNotify(true);
		setTimeout(() => {
			clearNotification();
		}, 5000);
	});

	const clearNotification = useCallback(() => {
		setNotify(false);
		setMessage(null);
		setError(false);
	});

	const authenticate = useCallback((token, name, id, role, user) => {
		setToken(token);
		setName(name);
		setUserId(id);
		setUser(user);
		setRole(role);
		localStorage.setItem(
			'authData',
			JSON.stringify({
				token,
				name,
				id,
				role,
				user
			})
		);
		setIsLoading(false);
		return <Redirect to={'/'} />;
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setName(null);
		setUserId(null);

		setRole(null);
		localStorage.removeItem('authData');
		localStorage.clear();
		return <Redirect to={'/login'} />;
	}, []);

	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('authData'));
		if (storedData && storedData.token) {
			authenticate(
				storedData.token,
				storedData.name,
				storedData.id,

				storedData.role,
				storedData.user
			);
		}
		setIsLoading(false);
	}, [authenticate]);

	let routes;
	if (token && role === 'user') {
		routes = (
			<Switch>
				<Route exact path='/login'>
					<Login />
				</Route>
			</Switch>
		);
	} else if (token && role === 'instructor') {
		routes = (
			<Switch>
				<Route exact path='/'>
					<Homepage />
				</Route>
				<Route exact path='/login'>
					<Login />
				</Route>
				<Redirect to='/'></Redirect>
			</Switch>
		);
	} else if (token && role === 'admin') {
		routes = (
			<Switch>
				<Route exact path='/'>
					<Homepage />
				</Route>
				<Route exact path='/add-package'>
					<Homepage />
				</Route>
				<Route exact path='/login'>
					<Login />
				</Route>
				<Redirect to='/'></Redirect>
			</Switch>
		);
	} else {
		routes = (
			<Switch>
				<Route exact path='/'>
					<Login />
				</Route>
				<Route exact path='/login'>
					<Login />
				</Route>

				<Redirect to='/login'></Redirect>
			</Switch>
		);
	}

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: !!token,
				token,
				fullName: name,
				userId: userId,
				role: role,
				user,
				authenticate,
				logout: logout
			}}>
			<NotificationContext.Provider
				value={{
					notify,
					message,
					error,
					showNotification: setNotification,
					clearNotification: clearNotification
				}}>
				<BrowserRouter>
					<div>
						<Navbar />
						<Notification />

						<div className='container'>{!isLoading && routes}</div>
					</div>
				</BrowserRouter>
			</NotificationContext.Provider>
		</AuthContext.Provider>
	);
}

export default App;
