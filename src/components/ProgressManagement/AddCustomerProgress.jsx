import axios from 'axios';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import BMICalulator from './BMICalulator';

const AddCustomerProgress = (props) => {
	const currentCustomer = props.location.state.user;
	const auth = useContext(AuthContext);
	const notification = useContext(NotificationContext);
	const [progressData, setProgressData] = useState({
		height: '',
		weight: '',
		bicep: '',
		thigh: '',
		hips: '',
		chest: '',
		arm: '',
		shoulder: '',
		bmi: ''
	});
	const [bmiVal, setBmiVal] = useState();
	const {
		height,
		weight,
		bicep,
		thigh,
		hips,
		chest,
		arm,
		shoulder
	} = progressData;
	const handleChange = (e) => {
		setProgressData({
			...progressData,
			[e.target.name]: e.target.value
		});
	};

	const calculateBmi = () => {
		if (height !== '' && weight !== '') {
			let tempbmi = (weight / height / height) * 10000;
			tempbmi = tempbmi.toFixed(2);
			setBmiVal(tempbmi);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (height === '' || weight === '') {
			notification.showNotification(
				'please fill the all fields, including height and weight fields. ',
				true
			);
			return;
		}
		try {
			calculateBmi();
			const body = {
				userId: currentCustomer._id,
				height,
				weight,
				bicep,
				thigh,
				hips,
				chest,
				arm,
				shoulder,
				bmi: bmiVal
			};
			const config = {
				headers: {
					'x-auth-token': `${auth.token}`,
					'Content-Type': 'application/json'
				}
			};
			const response = await axios.post(
				`${process.env.REACT_APP_BASE_URL}/api/progress`,
				body,
				config
			);
			if (response.status === 201) {
				notification.showNotification(
					'Progress added successfully',
					false
				);
				window.history.back();
			}
		} catch (error) {
			notification.showNotification('Something went wrong', true);
		}
	};
	return (
		<div className='row pb-5'>
			<div className='col-md-12 my-2'>
				<h1>Add Customer progress</h1>
			</div>
			<div className='row justify-content-center mt-2'>
				<div className='col-md-6 text-center'>
					<img
						src={currentCustomer.image.replace(/\s+/g, '%20')}
						width='120px'
						className='rounded-circle img-thumbnail'
						alt=''
					/>
					<h4>
						{currentCustomer.firstName} {currentCustomer.lastName}
					</h4>
				</div>
			</div>
			<div className='row justify-content-center py-3 border'>
				<BMICalulator
					calculateBmi={calculateBmi}
					handleChange={handleChange}
					bmi={bmiVal}
					height={height}
					weight={weight}
				/>
				<div className='row justify-content-center'>
					<form
						className='col-md-6 p-3 border'
						onSubmit={handleSubmit}>
						<div className='row'>
							<div className='mb-3 col-6'>
								<label htmlFor='thigh'>thigh</label>
								<input
									type='thigh'
									name='thigh'
									className='form-control'
									value={thigh}
									onChange={handleChange}
									required
									placeholder='12cm'
								/>
							</div>
							<div className='mb-3 col-6'>
								<label htmlFor='bicep'>bicep</label>
								<input
									type='bicep'
									name='bicep'
									className='form-control'
									value={bicep}
									onChange={handleChange}
									required
									placeholder='22cm'
								/>
							</div>
							<div className='mb-3 col-6'>
								<label htmlFor='hips'>hips</label>
								<input
									type='hips'
									name='hips'
									className='form-control'
									value={hips}
									onChange={handleChange}
									required
									placeholder='24cm'
								/>
							</div>
							<div className='mb-3 col-6'>
								<label htmlFor='chest'>chest</label>
								<input
									type='chest'
									name='chest'
									className='form-control'
									value={chest}
									onChange={handleChange}
									required
									placeholder='30cm'
								/>
							</div>
							<div className='mb-3 col-6'>
								<label htmlFor='arm'>arm</label>
								<input
									type='arm'
									name='arm'
									className='form-control'
									value={arm}
									onChange={handleChange}
									required
									placeholder='16cm'
								/>
							</div>
							<div className='mb-3 col-6'>
								<label htmlFor='shoulder'>shoulder</label>
								<input
									type='shoulder'
									name='shoulder'
									className='form-control'
									value={shoulder}
									onChange={handleChange}
									required
									placeholder='28cm'
								/>
							</div>
							<div className='mb-3 col-md-12 w-100'>
								<button className='btn btn-primary w-100'>
									Save
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddCustomerProgress;
