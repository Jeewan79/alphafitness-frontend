import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';

const UpdateCustomer = (props) => {
	const user = props.location.state.user;

	const [packages, setPackages] = useState([]);
	const auth = useContext(AuthContext);
	const notification = useContext(NotificationContext);
	const [customer, setCustomer] = useState({
		userId: user._id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		address: user.address,
		age: user.age,
		mobile: user.mobile,
		packageId: user.package._id
	});

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
	const {
		userId,
		email,
		firstName,
		lastName,
		address,
		age,
		mobile,
		packageId
	} = customer;

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
			userId,
			email,
			firstName,
			lastName,
			address,
			age,
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
			const response = await axios.put(
				`${process.env.REACT_APP_BASE_URL}/api/auth/update`,
				body,
				config
			);

			if (response.status === 200) {
				notification.showNotification(response.data.msg, false);
				window.location.replace('/manage-users');
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
	};
	return (
		<div className='container pb-5'>
			<div className='row justify-content-center pb-5'>
				<div className='col-lg-6  col-md-6 col-sm-12 col-xs-12 background-border'>
					<div className='row m-2 text-center'>
						<h3>Update Customer - {user.firstName}</h3>
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
							<label htmlFor='age'>Age</label>
							<input
								type='text'
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
								Update customer
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default UpdateCustomer;
