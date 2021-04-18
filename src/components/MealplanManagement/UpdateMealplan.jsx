import axios from 'axios';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';

const UpdateMealplan = (props) => {
	const currentPlan = props.location.state.plan;
	const notification = useContext(NotificationContext);
	const auth = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [mealplan, setMealplan] = useState({
		planId: currentPlan._id,
		name: currentPlan.name,
		description: currentPlan.description,
		category: currentPlan.category
	});

	const { name, description, category } = mealplan;

	const handleChange = (e) => {
		setMealplan({
			...mealplan,
			[e.target.name]: e.target.value
		});
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const config = {
				headers: {
					'x-auth-token': `${auth.token}`,
					'Content-Type': 'application/json'
				}
			};

			const res = await axios.put(
				`${process.env.REACT_APP_BASE_URL}/api/mealplan/update`,
				mealplan,
				config
			);

			if (res.status === 200) {
				notification.showNotification(
					'Mealplan udpated successfully',
					false
				);
				setMealplan({
					name: '',
					description: '',
					category: ''
				});
				setTimeout(() => {
					window.history.back();
				}, [500]);
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
						<h3>update Mealplan {currentPlan.name}</h3>
					</div>
					<hr />
					<form onSubmit={onSubmit}>
						<div className='mb-3'>
							<label htmlFor='name'>Mealplan name</label>
							<input
								type='text'
								name='name'
								className='form-control'
								value={name}
								onChange={handleChange}
								required
								placeholder='Keto diet'
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='category'>Category</label>
							<input
								type='text'
								name='category'
								className='form-control'
								value={category}
								onChange={handleChange}
								required
								placeholder='Lunch'
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='description'>Description</label>
							<textarea
								rows={8}
								name='description'
								className='form-control'
								value={description}
								onChange={handleChange}
								required
								placeholder='Description about mealplan'
							/>
						</div>

						<div className='mb-3'>
							<button
								className='btn btn-primary w-100'
								disabled={loading ? true : false}>
								{loading ? 'Updating' : 'Update'} Mealplan
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default UpdateMealplan;
