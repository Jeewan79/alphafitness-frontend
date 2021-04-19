import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';

const UpdateFeedback = (props) => {
	const currentFeedback = props.location.state.feedback;

	const auth = useContext(AuthContext);
	const notification = useContext(NotificationContext);
	const [feedback, setFeedack] = useState({
		appearance: currentFeedback.appearance,
		quality: currentFeedback.quality,
		overall: currentFeedback.overall
	});
	const options = [1, 2, 3, 4, 5];
	const { appearance, quality, overall } = feedback;

	const handleChange = (e) => {
		setFeedack({
			...feedback,
			[e.target.name]: parseInt(e.target.value)
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const body = {
			feedbackId: currentFeedback._id,
			appearance,
			quality,
			overall
		};
		try {
			const config = {
				headers: {
					'x-auth-token': `${auth.token}`,
					'Content-Type': 'application/json'
				}
			};
			const response = await axios.put(
				`${process.env.REACT_APP_BASE_URL}/api/feedback/update`,
				body,
				config
			);

			if (response.status === 200) {
				notification.showNotification(response.data.msg, false);
				setTimeout(() => {
					window.location.replace('/manage-feedbacks');
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

		setFeedack({
			appearance: 5,
			quality: 5,
			overall: 5
		});
	};

	const renderSwitch = (para) => {
		switch (para) {
			case 1:
				return 'Poor';
			case 2:
				return 'Normal';
			case 3:
				return 'Medium';
			case 4:
				return 'Good';
			case 5:
				return 'Excellent';
			default:
				return 'Excellent';
		}
	};
	return (
		<div className='container pb-5'>
			<div className='row justify-content-center pb-5'>
				<div className='col-lg-6  col-md-6 col-sm-12 col-xs-12 background-border'>
					<div className='row m-2 text-center'>
						<h3>Add Feedback</h3>
					</div>
					<hr />
					<form onSubmit={handleSubmit}>
						<div className='row my-3'>
							Gym appearance of facilities
							<div className='mb-3 justify-content-between d-flex'>
								{options.map((option, idx) => {
									return (
										<div
											className='form-check form-check-inline '
											key={idx}>
											<input
												className='form-check-input'
												type='radio'
												name='appearance'
												onChange={handleChange}
												value={option}
												checked={
													option === appearance
														? true
														: false
												}
											/>
											<label
												className='form-check-label'
												htmlFor='inlineRadio1'>
												{renderSwitch(option)}
											</label>
										</div>
									);
								})}
							</div>
						</div>

						<div className='row my-3'>
							Quality of activities
							<div className='mb-3 justify-content-between d-flex'>
								{options.map((option, idx) => {
									return (
										<div
											className='form-check form-check-inline '
											key={idx}>
											<input
												className='form-check-input'
												type='radio'
												name='quality'
												onChange={handleChange}
												value={option}
												checked={
													option === quality
														? true
														: false
												}
											/>
											<label
												className='form-check-label'
												htmlFor='inlineRadio1'>
												{renderSwitch(option)}
											</label>
										</div>
									);
								})}
							</div>
						</div>
						<div className='row my-3'>
							Your overall satisfaction
							<div className='mb-3 justify-content-between d-flex'>
								{options.map((option, idx) => {
									return (
										<div
											className='form-check form-check-inline '
											key={idx}>
											<input
												className='form-check-input'
												type='radio'
												name='overall'
												onChange={handleChange}
												value={option}
												checked={
													option === overall
														? true
														: false
												}
											/>
											<label
												className='form-check-label'
												htmlFor='inlineRadio1'>
												{renderSwitch(option)}
											</label>
										</div>
									);
								})}
							</div>
						</div>
						<div className='mb-3'>
							<button className='btn btn-primary w-100'>
								Add Feedback
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default UpdateFeedback;
