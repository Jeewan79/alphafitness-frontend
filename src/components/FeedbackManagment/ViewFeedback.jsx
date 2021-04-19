import axios from 'axios';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ViewFeedback = ({ feedbacks }) => {
	const auth = useContext(AuthContext);
	const notification = useContext(NotificationContext);
	const doc = new jsPDF();
	const genPdf = () => {
		doc.text('Feedbacks of Alpha fitness gym', 10, 10);
		doc.autoTable({ html: '#my-table' });

		let array = [];
		feedbacks.map((f, idx) => {
			let item = [];
			item.push(idx + 1);
			item.push(f.date.substring(0, 10));
			item.push(f.user.email);
			item.push(renderSwitch(f.appearance));
			item.push(renderSwitch(f.quality));
			item.push(renderSwitch(f.overall));
			array.push(item);
			return item;
		});
		// Or use javascript directly:
		doc.autoTable({
			head: [
				[
					'#',
					'Date',
					'Customer',
					'Gym Appearance',
					'Quality',
					'Overall'
				]
			],

			body: array
		});

		doc.save('Feedbacks.pdf');
	};
	const deleteFeedback = async (feedback) => {
		try {
			const response = await axios.delete(
				`${process.env.REACT_APP_BASE_URL}/api/feedback/delete`,
				{
					headers: {
						'x-auth-token': `${auth.token}`,
						'Content-Type': 'application/json'
					},
					data: {
						feedbackId: feedback._id
					}
				}
			);

			if (response.status === 200) {
				notification.showNotification(response.data.msg, false);
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
		<div className='row'>
			<div className='col-md-12'>
				<table className='table'>
					<thead>
						<tr>
							<th scope='col'>#</th>
							<th scope='col'>Date</th>
							<th scope='col'>Customer</th>
							<th scope='col'>Gym Appearance</th>
							<th scope='col'>Quality of activities</th>
							<th scope='col'>Overall satisfaction</th>
							{auth.role === 'user' && (
								<th scope='col'>Manage</th>
							)}
						</tr>
					</thead>
					<tbody>
						{feedbacks.map((feedback, idx) => {
							return (
								<tr key={idx}>
									<th scope='row'>{idx + 1}</th>
									<td>{feedback.date.substring(0, 10)}</td>
									<td>{feedback.user.email}</td>
									<td>{renderSwitch(feedback.appearance)}</td>
									<td>{renderSwitch(feedback.quality)}</td>
									<td>{renderSwitch(feedback.overall)}</td>

									{feedback.user._id === auth.user._id && (
										<td className='text-center'>
											<Link
												to={{
													pathname:
														'/update-feedback',
													state: {
														feedback: feedback
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
															'Are you sure you need to delete this customer? If you delete this customer, his/her orders will be deleted too!'
														)
													)
														deleteFeedback(
															feedback
														);
												}}></i>
										</td>
									)}
								</tr>
							);
						})}
					</tbody>
				</table>

				{auth.role === 'admin' && (
					<div className='row justify-content-end mt-5'>
						<button
							className='btn btn-primary w-25 '
							onClick={genPdf}>
							Genarate pdf
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ViewFeedback;
