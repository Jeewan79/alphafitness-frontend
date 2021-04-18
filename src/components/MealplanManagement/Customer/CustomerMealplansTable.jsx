import axios from 'axios';
import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { NotificationContext } from '../../../context/NotificationContext';

const CustomerMealplansTable = ({ mealplans, user }) => {
	const auth = useContext(AuthContext);
	const notification = useContext(NotificationContext);

	const removeMealplanFromUser = async (mealplan) => {
		try {
			const response = await axios.delete(
				`${process.env.REACT_APP_BASE_URL}/api/mealplan/remove`,
				{
					headers: {
						'x-auth-token': `${auth.token}`,
						'Content-Type': 'application/json'
					},
					data: {
						userId: user._id,
						planId: mealplan._id
					}
				}
			);

			if (response.status === 200) {
				notification.showNotification(
					'Meal plan removed successfully from this user',
					false
				);
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
	return (
		<div className='row '>
			<div className='col-md-12'>
				<table className='table table-striped'>
					<thead>
						<tr>
							<th scope='col'>#</th>
							<th scope='col'>mealplan</th>
							<th scope='col'>mealplan Type</th>
							<th scope='col'>Description</th>

							{auth.role === 'instructor' && <th>Remove</th>}
						</tr>
					</thead>
					<tbody>
						{mealplans.map((mealplan, idx) => {
							return (
								<tr key={idx}>
									<th scope='row'>{idx + 1}</th>
									<td>{mealplan.name}</td>
									<td>{mealplan.category}</td>
									<td className='col-6'>
										{mealplan.description}
									</td>

									{auth.role === 'instructor' && (
										<td>
											<i
												className='fas fa-trash-alt pe-3'
												style={{
													color: 'red',
													fontSize: '22px'
												}}
												onClick={() => {
													if (
														window.confirm(
															'Are you sure you need to remove this mealplan from this user?'
														)
													)
														removeMealplanFromUser(
															mealplan
														);
												}}></i>
										</td>
									)}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default CustomerMealplansTable;
