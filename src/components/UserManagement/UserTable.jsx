import axios from 'axios';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';

const UserTable = ({ customers }) => {
	const auth = useContext(AuthContext);
	const notification = useContext(NotificationContext);

	const deleteCustomer = async (customer) => {
		try {
			const response = await axios.delete(
				`${process.env.REACT_APP_BASE_URL}/api/auth/delete`,
				{
					headers: {
						'x-auth-token': `${auth.token}`,
						'Content-Type': 'application/json'
					},
					data: {
						userId: customer._id
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
	return (
		<div className='row'>
			<div className='col-md-12'>
				<table className='table'>
					<thead>
						<tr>
							<th scope='col'>#</th>
							<th scope='col'>First Name</th>
							<th scope='col'>Email</th>
							<th scope='col'>Manage</th>
						</tr>
					</thead>
					<tbody>
						{customers.map((customer, idx) => {
							return (
								<tr key={idx}>
									<th scope='row'>{idx + 1}</th>
									<td>{customer.firstName}</td>
									<td>{customer.email}</td>
									<td className='text-center'>
										<Link
											to={{
												pathname: '/customer-profile',
												state: {
													customer: customer,
													role: auth.role
												}
											}}>
											<i
												className='fas fa-eye pe-3'
												style={{
													fontSize: '22px',
													color: 'green'
												}}></i>
										</Link>
										<Link
											to={{
												pathname: '/update-customer',
												state: {
													user: customer
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
													deleteCustomer(customer);
											}}></i>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default UserTable;
