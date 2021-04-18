import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { NotificationContext } from '../../../context/NotificationContext';

const CreateBrand = () => {
	const auth = useContext(AuthContext);
	const notification = useContext(NotificationContext);
	const [brand, setBrand] = useState({
		name: ''
	});

	const { name } = brand;

	const handleChange = (e) => {
		setBrand({
			...brand,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const body = {
			name
		};
		try {
			const config = {
				headers: {
					'x-auth-token': `${auth.token}`,
					'Content-Type': 'application/json'
				}
			};
			const response = await axios.post(
				`${process.env.REACT_APP_BASE_URL}/api/product/brand`,
				body,
				config
			);

			if (response.status === 201) {
				notification.showNotification(response.data.msg, false);
				setTimeout(() => {
					window.history.back();
				}, 1000);
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

		setBrand({
			name: ''
		});
	};

	return (
		<div className='container pb-5'>
			<div className='row justify-content-center pb-5'>
				<div className='col-lg-6  col-md-6 col-sm-12 col-xs-12 background-border'>
					<div className='row m-2 text-center'>
						<h3>Add Product brand</h3>
					</div>
					<hr />
					<form onSubmit={handleSubmit}>
						<div className='mb-3'>
							<label htmlFor='name'>Brand Name</label>
							<input
								type='name'
								name='name'
								className='form-control'
								id='name'
								value={name}
								onChange={handleChange}
								required
								placeholder='adidas'
							/>
						</div>

						<div className='mb-3'>
							<button className='btn btn-primary w-100'>
								Add Brand
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateBrand;
