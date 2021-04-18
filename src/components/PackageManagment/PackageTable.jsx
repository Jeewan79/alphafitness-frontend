import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';

const PackageTable = ({ packages, auth, notification }) => {
	const deletePackage = async (pack) => {
		try {
			const response = await axios.delete(
				`${process.env.REACT_APP_BASE_URL}/api/package/delete`,
				{
					headers: {
						'x-auth-token': `${auth.token}`,
						'Content-Type': 'application/json'
					},
					data: {
						id: pack._id
					}
				}
			);

			if (response.status === 201) {
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
		<div className='row '>
			<div className='col-md-12'>
				<table className='table'>
					<thead>
						<tr>
							<th scope='col'>#</th>
							<th scope='col'>Type</th>
							<th scope='col'>Package</th>
							<th scope='col'>Description</th>
							<th scope='col'>Price</th>

							{auth.role === 'admin' && (
								<th scope='col'>Manage</th>
							)}
						</tr>
					</thead>
					<tbody>
						{packages.map((pack, idx) => {
							return (
								<tr key={idx}>
									<th scope='row'>{idx + 1}</th>
									<td>{pack.category.name}</td>
									<td>{pack.name}</td>
									<td>{pack.description}</td>
									<td>{pack.price}</td>

									{auth.role === 'admin' && (
										<td className='text-center'>
											<Link
												to={{
													pathname: '/update-package',
													state: {
														package: pack
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
															'Are you sure you need to delete this Package? You cannot delete a package if customer are assigned to it'
														)
													)
														deletePackage(pack);
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

export default PackageTable;
