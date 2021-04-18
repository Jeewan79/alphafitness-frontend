import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';

const AddPackage = () => {
	const [loading, setLoading] = useState(true);
	const [types, setTypes] = useState([]);
	const [packageDetails, setPackageDetails] = useState({
		name: '',
		price: '',
		description: '',
		categoryId: ''
	});
	const auth = useContext(AuthContext);
	const notification = useContext(NotificationContext);
	const { name, price, description, categoryId } = packageDetails;
	const handleChange = (e) => {
		setPackageDetails({
			...packageDetails,
			[e.target.name]: e.target.value
		});
	};

	const getPackageTypes = async () => {
		try {
			const res = await axios.get(
				`${process.env.REACT_APP_BASE_URL}/api/package/cat`
			);
			if (res.status === 200) {
				setTypes(res.data.categories);
			}
		} catch (error) {}
		setLoading(false);
	};
	useEffect(() => {
		getPackageTypes();
	}, []);

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();
		try {
			if (categoryId === '') {
				notification.showNotification(
					'Please choose a package type',
					true
				);
				return;
			} else {
				const config = {
					headers: {
						'x-auth-token': `${auth.token}`,
						'Content-Type': 'application/json'
					}
				};

				const res = await axios.post(
					`${process.env.REACT_APP_BASE_URL}/api/package`,
					packageDetails,
					config
				);

				if (res.status === 201) {
					notification.showNotification(
						'package created successfully',
						false
					);
					setLoading(false);

					setPackageDetails({
						name: '',
						price: '',
						description: '',
						categoryId: ''
					});
					setTimeout(() => {
						window.history.back();
					}, [500]);
				} else {
					notification.showNotification('Please try again', true);
				}
			}
		} catch (error) {
			notification.showNotification('Please try again', true);
		}
		setLoading(false);
	};
	return (
		<div className='container pb-5'>
			<div className='row justify-content-center pb-5'>
				<div className='col-lg-6  col-md-6 col-sm-12 col-xs-12 background-border'>
					<div className='row m-2 text-center'>
						<h3>Add Package</h3>
					</div>
					<hr />
					<form onSubmit={handleSubmit}>
						<div className='mb-3'>
							<label htmlFor='name'>Pakcage name</label>
							<input
								type='text'
								name='name'
								className='form-control'
								value={name}
								onChange={handleChange}
								required
								placeholder='Weekend'
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='price'>Price</label>
							<input
								type='number'
								name='price'
								className='form-control'
								value={price}
								onChange={handleChange}
								required
								placeholder='12500'
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='description'>Description</label>
							<input
								type='text'
								name='description'
								className='form-control'
								value={description}
								onChange={handleChange}
								required
								placeholder='Description about package'
							/>
						</div>

						<div className='mb-3'>
							<label htmlFor='categoryId'>Type</label>
							{types.length > 0 ? (
								<select
									name='categoryId'
									onChange={handleChange}
									className='form-select'
									aria-label='Default select example'>
									<option hidden>Choose type</option>

									{types.map((type, idx) => {
										return (
											<option value={type._id} key={idx}>
												{type.name}
											</option>
										);
									})}
								</select>
							) : (
								<Link
									className='btn btn-primary w-100'
									to='add-package-type'>
									Please add package type
								</Link>
							)}
						</div>
						<div className='mb-3'>
							<button
								className='btn btn-primary w-100'
								disabled={loading}>
								{loading ? 'Creating' : 'Create'} Package
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddPackage;
