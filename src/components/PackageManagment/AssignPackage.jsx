import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { NotificationContext } from '../../context/NotificationContext';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const AssignPackage = () => {
	const auth = useContext(AuthContext);
	const notification = useContext(NotificationContext);
	const [packages, setPackages] = useState([]);
	const [user, setUser] = useState({
		packageId: '',
		email: ''
	});

	const { email, packageId } = user;
	useEffect(() => {
		fetchPackages();
	}, []);
	const fetchPackages = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_BASE_URL}/api/package/`
			);
			if (response.status === 200) {
				setPackages(response.data.packages);
			}
		} catch (error) {}
	};
	const handleChange = (e) => {
		setUser({
			...user,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (packageId === '') {
			notification.showNotification('please select a package', true);
			return;
		}
		const body = {
			email,
			packageId
		};
		try {
			const config = {
				headers: {
					'x-auth-token': `${auth.token}`,
					'Content-Type': 'application/json'
				}
			};
			const response = await axios.put(
				`${process.env.REACT_APP_BASE_URL}/api/package/assign`,
				body,
				config
			);

			if (response.status === 200) {
				notification.showNotification(response.data.msg, false);
				setTimeout(() => {
					window.history.back();
				}, 1000);
			} else {
				notification.showNotification(response.data.msg, true);
			}
		} catch (error) {
			notification.showNotification(error.response.data.msg, true);
		}

		setUser({
			packageId: '',
			email: ''
		});
	};

	return (
		<div className='container pb-5'>
			<div className='row justify-content-center pb-5'>
				<div className='col-lg-6  col-md-6 col-sm-12 col-xs-12 background-border'>
					<div className='row m-2 text-center'>
						<h3>Assign Package to user</h3>
					</div>
					<hr />
					<form onSubmit={handleSubmit}>
						<div className='mb-3'>
							<label htmlFor='email'>User Email</label>
							<input
								type='email'
								name='email'
								className='form-control'
								value={email}
								onChange={handleChange}
								required
								placeholder='user@gmail.com'
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='packageId'>package</label>
							{packages.length > 0 ? (
								<select
									name='packageId'
									onChange={handleChange}
									className='form-select'
									aria-label='Default select example'
									value={packageId}>
									<option hidden>Select package</option>
									{packages.map((p, idx) => {
										return (
											<option value={p._id} key={idx}>
												{p.name}
											</option>
										);
									})}
								</select>
							) : (
								<Link
									to='/add-package'
									className='btn btn-primary w-100'>
									Create package
								</Link>
							)}
						</div>

						<div className='mb-3'>
							<button className='btn btn-primary w-100'>
								Assign this package
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AssignPackage;
