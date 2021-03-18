import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';

const Login = ({}) => {
	const auth = useContext(AuthContext);
	const notification = useContext(NotificationContext);
	const [user, setUserData] = useState({
		email: '',
		password: ''
	});

	const { email, password } = user;
	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('ere');
		const body = {
			email,
			password
		};
		try {
			const response = await axios.post(
				'http://localhost:5000/api/auth/login',
				body,
				{ ContentType: 'application/json' }
			);

			if (response.data.token != null) {
				auth.authenticate(
					response.data.token,
					response.data.firstName + ' ' + response.data.lastName,
					response.data.id,
					response.data.role,
					response.data.user
				);
			} else {
				notification.showNotification(
					'please check your credentials',
					true
				);
			}
		} catch (error) {
			notification.showNotification(
				'please check your credentials',
				true
			);
		}
	};

	const handleChange = (e) => {
		setUserData({
			...user,
			[e.target.name]: e.target.value
		});
	};
	return (
		<div className='container'>
			<div className='row justify-content-center'>
				<div className='col-lg-6  col-md-6 col-sm-12 col-xs-12 background-border'>
					<div className='row m-2 text-center'>
						<h3>ALPHA FITNESS CENTER</h3>
					</div>
					<hr />
					<div className='row  text-center mb-5 justify-content-center'>
						<img
							src='https://www.shareicon.net/data/512x512/2016/07/26/802043_man_512x512.png'
							alt=''
							className='avatar-image mb-2'
						/>
						<h2>Login page</h2>
					</div>
					<form onSubmit={handleSubmit}>
						<div className='mb-3'>
							<label htmlFor='email'>Email</label>
							<input
								type='email'
								name='email'
								className='form-control'
								id='email'
								value={email}
								onChange={handleChange}
								required
								placeholder='john@gmail.com'
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='password'>password</label>
							<input
								type='password'
								name='password'
								className='form-control'
								id='password'
								value={password}
								onChange={handleChange}
								required
							/>
						</div>
						<div className='mb-3'>
							<button className='btn btn-primary w-100'>
								Login
							</button>
							{/* <hr />
					<Link to='/register' className='btn btn-danger w-100'>
						Register
					</Link> */}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
