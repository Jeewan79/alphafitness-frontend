import axios from 'axios';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import './Advertisment.styles.css';

const AdverismentTable = ({ advertisments }) => {
	const auth = useContext(AuthContext);
	const notification = useContext(NotificationContext);

	const deleteAd = async (ad) => {
		try {
			const res = await axios.delete(
				`${process.env.REACT_APP_BASE_URL}/api/advertisment/delete`,
				{
					headers: {
						'x-auth-token': `${auth.token}`,
						'Content-Type': 'application/json'
					},
					data: {
						adId: ad._id
					}
				}
			);
			if (res.status === 200) {
				notification.showNotification('Advertisment deleted', false);
			} else {
				notification.showNotification(
					'Unable to delete the advertisment',
					true
				);
			}
		} catch (error) {
			notification.showNotification(
				'Unable to delete the advertisment',
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
							<th scope='col'>Id</th>
							<th scope='col'>Title</th>
							<th scope='col'>Description</th>
							{auth.role === 'admin' && (
								<th scope='col'>Image</th>
							)}
							<th scope='col'>Posted By</th>
							<th scope='col'>Manage</th>
						</tr>
					</thead>
					<tbody>
						{advertisments.map((ad, idx) => {
							return (
								<tr key={idx}>
									<th scope='row'>{idx + 1}</th>
									<th>
										{ad._id
											.split('')
											.reverse()
											.join('')
											.substring(0, 5)}
									</th>
									<td>{ad.title}</td>
									<td>{ad.description}</td>
									<td>
										<img
											alt='adverisment'
											src={ad.image.replace(
												/\s+/g,
												'%20'
											)}
											width='150px'
										/>
									</td>
									{auth.role === 'admin' && (
										<td>{ad.user.firstName}</td>
									)}
									<td className='text-center'>
										<Link
											to={{
												pathname: `/view-advertisment`,
												state: {
													ad: ad
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
												pathname:
													'/update-advertisment',
												state: {
													ad: ad
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
														'Are you sure you need to delete this advertisment?'
													)
												)
													deleteAd(ad);
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

export default AdverismentTable;
