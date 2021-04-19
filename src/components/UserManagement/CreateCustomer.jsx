import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';

const CreateCustomer = () => {
	const auth = useContext(AuthContext);
	const notification = useContext(NotificationContext);
	const [packages, setPackages] = useState([]);
	const [customer, setCustomer] = useState({
		email: '',
		firstName: '',
		lastName: '',
		password: '',
		address: '',
		age: '',
		gender: '',
		mobile: '',
		packageId: ''
	});

	const {
		email,
		firstName,
		lastName,
		password,
		address,
		age,
		gender,
		mobile,
		packageId
	} = customer;

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
		setCustomer({
			...customer,
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
			firstName,
			lastName,
			password,
			address,
			age,
			gender,
			mobile,
			packageId
		};
		try {
			const config = {
				headers: {
					'x-auth-token': `${auth.token}`,
					'Content-Type': 'application/json'
				}
			};
			const response = await axios.post(
				`${process.env.REACT_APP_BASE_URL}/api/auth/create`,
				body,
				config
			);

			if (response.status === 200) {
				notification.showNotification(response.data.msg, false);
			} else {
				notification.showNotification(
					'please check your credentials',
					true
				);
			}
		} catch (error) {
			notification.showNotification(
				'something went wrong. please try again',
				true
			);
		}

		setCustomer({
			email: '',
			firstName: '',
			lastName: '',
			password: '',
			address: '',
			age: '',
			gender: '',
			mobile: '',
			packageId: ''
		});
	};
	return (
		<div className='container pb-5'>
			<div className='row justify-content-center pb-5'>
				<div className='col-lg-6  col-md-6 col-sm-12 col-xs-12 background-border'>
					<div className='row m-2 text-center'>
						<h3>Add Customer</h3>
					</div>
					<hr />
					<form onSubmit={handleSubmit}>
						<div className='mb-3'>
							<label htmlFor='email'>Email</label>
							<input
								type='email'
								name='email'
								className='form-control'
								value={email}
								onChange={handleChange}
								required
								placeholder='john@gmail.com'
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='firstName'>First name</label>
							<input
								type='text'
								name='firstName'
								className='form-control'
								value={firstName}
								onChange={handleChange}
								required
								placeholder='First Name'
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='lastName'>Last name</label>
							<input
								type='text'
								name='lastName'
								className='form-control'
								value={lastName}
								onChange={handleChange}
								required
								placeholder='Last Name'
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='password'>password</label>
							<input
								type='text'
								name='password'
								className='form-control'
								id='password'
								value={password}
								onChange={handleChange}
								required
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='address'>Address</label>
							<input
								type='text'
								name='address'
								className='form-control'
								id='address'
								value={address}
								onChange={handleChange}
								placeholder='SLIIT, Malabe'
								required
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='gender'>Gender</label>
							<input
								type='text'
								name='gender'
								className='form-control'
								id='gender'
								value={gender}
								onChange={handleChange}
								placeholder='male'
								required
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='age'>Age</label>
							<input
								type='number'
								name='age'
								className='form-control'
								id='age'
								value={age}
								onChange={handleChange}
								placeholder='23'
								required
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='mobile'>mobile</label>
							<input
								type='text'
								name='mobile'
								className='form-control'
								id='mobile'
								value={mobile}
								onChange={handleChange}
								placeholder='0711231231'
								required
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
								Create customer
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateCustomer;
