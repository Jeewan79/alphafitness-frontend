import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { NotificationContext } from '../../../context/NotificationContext';

const UpdatePackageType = (props) => {
	const updatingCategory = props.location.state.type;
	const auth = useContext(AuthContext);
	const notification = useContext(NotificationContext);
	const [category, setCategories] = useState({
		name: updatingCategory.name
	});

	const { name } = category;

	const handleChange = (e) => {
		setCategories({
			...category,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const body = {
			id: updatingCategory._id,
			name
		};
		try {
			const config = {
				headers: {
					'x-auth-token': `${auth.token}`,
					'Content-Type': 'application/json'
				}
			};
			const response = await axios.put(
				`${process.env.REACT_APP_BASE_URL}/api/package/category/update`,
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
					'please check your connection',
					true
				);
			}
		} catch (error) {
			notification.showNotification(
				'something went wrong. please try again',
				true
			);
		}

		setCategories({
			name: ''
		});
	};

	return (
		<div className='container pb-5'>
			<div className='row justify-content-center pb-5'>
				<div className='col-lg-6  col-md-6 col-sm-12 col-xs-12 background-border'>
					<div className='row m-2 text-center'>
						<h3>Update package type - {updatingCategory.name}</h3>
					</div>
					<hr />
					<form onSubmit={handleSubmit}>
						<div className='mb-3'>
							<label htmlFor='name'>package type name</label>
							<input
								type='name'
								name='name'
								className='form-control'
								id='name'
								value={name}
								onChange={handleChange}
								required
								placeholder='Adult'
							/>
						</div>

						<div className='mb-3'>
							<button className='btn btn-primary w-100'>
								update package type
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default UpdatePackageType;
