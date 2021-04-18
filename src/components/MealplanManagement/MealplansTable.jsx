import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';

const MealplansTable = ({ mealplans }) => {
	const auth = useContext(AuthContext);
	const notification = useContext(NotificationContext);
	const [assignToggle, setAssignToggle] = useState();
	const [userEmail, setUserEmail] = useState();

	const changeToggle = (mealplan) => {
		setAssignToggle(mealplan._id);
	};
	const handleChange = (e) => {
		setUserEmail(e.target.value);
	};
	const clearState = () => {
		setUserEmail(null);
		setAssignToggle(null);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const body = {
				userEmail,
				planId: assignToggle
			};
			const config = {
				headers: {
					'x-auth-token': `${auth.token}`,
					'Content-Type': 'application/json'
				}
			};
			const response = await axios.put(
				`${process.env.REACT_APP_BASE_URL}/api/mealplan/add`,
				body,
				config
			);

			if (response.status === 200) {
				clearState();
				notification.showNotification(response.data.msg, false);
			}
		} catch (error) {
			if (error.response.status !== 500) {
				notification.showNotification(error.response.data.msg, true);
			} else {
				notification.showNotification(
					'Server error please try again',
					true
				);
			}
		}
	};
	const deleteMealplan = async (mealplan) => {
		try {
			const response = await axios.delete(
				`${process.env.REACT_APP_BASE_URL}/api/mealplan/delete`,
				{
					headers: {
						'x-auth-token': `${auth.token}`,
						'Content-Type': 'application/json'
					},
					data: {
						planId: mealplan._id
					}
				}
			);

			if (response.status === 200) {
				notification.showNotification(response.data.msg, false);
			}
		} catch (error) {
			if (error.response.status === 400) {
				notification.showNotification(
					'Some users are using this mealplan. Please change it before deleting',
					true
				);
				return;
			}
			notification.showNotification(
				'something went wrong. please try again',
				true
			);
		}
	};
	return (
		<div className='row '>
			<div className='col-md-12'>
				<table className='table table-striped'>
					<thead>
						<tr>
							<th scope='col'>#</th>
							<th scope='col'>Name</th>
							<th scope='col'>Type</th>
							<th scope='col'>Description</th>
							<th scope='col'>Created by</th>
							<th scope='col'>Manage</th>
							<th scope='col'>Assign to user</th>
						</tr>
					</thead>
					<tbody>
						{mealplans.map((mealplan, idx) => {
							return (
								<>
									<tr key={idx}>
										<th scope='row'>{idx + 1}</th>
										<td>{mealplan.name}</td>
										<td>{mealplan.category}</td>
										<td className='col-4'>
											{mealplan.description.substring(
												0,
												60
											)}
											...
										</td>
										<td>{mealplan.createdBy.firstName}</td>

										<td className='text-center'>
											<Link
												to={{
													pathname:
														'/update-mealplan',
													state: {
														plan: mealplan
													}
												}}>
												<i
													className='fas fa-user-edit pe-3'
													style={{
														fontSize: '22px'
													}}></i>
											</Link>
											<i
												className='fas fa-trash-alt pe-3'
												style={{
													color: 'red',
													fontSize: '22px'
												}}
												onClick={() => {
													if (
														window.confirm(
															'Are you sure you need to delete this mealplan? You cannot delete a mealplan if customers are using it'
														)
													)
														deleteMealplan(
															mealplan
														);
												}}></i>
										</td>
										<td>
											<button
												className='btn btn-outline-primary'
												onClick={() =>
													changeToggle(mealplan)
												}>
												Assign
											</button>
										</td>
									</tr>
									{assignToggle === mealplan._id && (
										<tr
											className=''
											style={{
												backgroundColor: '#e6f5ff'
											}}>
											<td colSpan={7}>
												<div className='row justify-content-center'>
													<div className='col-md-6'>
														<form
															onSubmit={
																handleSubmit
															}>
															<div className='mb-3'>
																<label htmlFor='email'>
																	User Email
																	address
																</label>
																<input
																	type='email'
																	name='email'
																	className='form-control'
																	value={
																		userEmail
																	}
																	onChange={
																		handleChange
																	}
																	required
																	placeholder='john@gmail.com'
																/>
															</div>
															<div className='mb-3'>
																<button className='btn btn-primary w-100'>
																	Add this
																	mealplan to
																	this user
																</button>
															</div>
															<button
																className='btn btn-danger w-100'
																onClick={
																	clearState
																}>
																cancel
															</button>
														</form>
													</div>
												</div>
											</td>
										</tr>
									)}
								</>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default MealplansTable;
