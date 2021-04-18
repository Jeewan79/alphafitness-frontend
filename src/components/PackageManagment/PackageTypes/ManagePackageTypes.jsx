import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../../context/AuthContext';
import { NotificationContext } from '../../../context/NotificationContext';

const ManagePackageTypes = () => {
	const auth = useContext(AuthContext);
	const [isLoading, setIsloading] = useState(true);
	const [packageTypes, setPackageTypes] = useState([]);
	const [searchData, setSearchData] = useState([]);
	const notification = useContext(NotificationContext);

	const search = (e) => {
		if (!e.target.value) {
			setSearchData(packageTypes);
		} else {
			let list = packageTypes.filter((pack) =>
				pack.name.toLowerCase().includes(e.target.value)
			);
			setSearchData(list);
		}
	};

	useEffect(() => {
		async function getData() {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_BASE_URL}/api/package/cat`
				);

				if (response.status === 200) {
					setPackageTypes(response.data.categories);
					setSearchData(response.data.categories);
				} else {
					notification.showNotification('No package types yet', true);
				}
			} catch (error) {
				notification.showNotification(error.response.data.msg, true);
			}
			setIsloading(false);
		}

		getData();
	}, [notification]);

	return (
		<div className='container pb-5 '>
			<div className='row justify-content-between my-3'>
				<h1>Manage Pakcage Tyeps</h1>
				<div className='col-md-5 my-2'>
					{!isLoading ? (
						<div className='input-group'>
							<div className='form-outline'>
								<input
									placeholder='search feedbacks'
									type='search'
									id='form1'
									className='form-control'
									onChange={search}
								/>
							</div>
							<button type='button' className='btn btn-primary'>
								<i className='fas fa-search'></i>
							</button>
						</div>
					) : (
						<div className='input-group'>
							<div className='form-outline'>
								<input
									placeholder='Loading...'
									disabled
									className='form-control'
								/>
							</div>
							<button type='button' className='btn btn-primary'>
								<i className='fas fa-spinner'></i>
							</button>
						</div>
					)}
				</div>
				{auth.role === 'admin' && (
					<React.Fragment>
						<div className='col-md-3 my-2'>
							<Link
								className='btn btn-primary w-100'
								to='/add-package-type'>
								Add Package Type
							</Link>
						</div>
					</React.Fragment>
				)}
			</div>
			{!isLoading ? (
				searchData.length > 0 ? (
					<div className='row '>
						<div className='col-md-12'>
							<table className='table'>
								<thead>
									<tr>
										<th scope='col'>#</th>
										<th scope='col'>id</th>
										<th scope='col'>Name</th>
										<th scope='col'>Manage</th>
									</tr>
								</thead>
								<tbody>
									{searchData.map((type, idx) => {
										return (
											<tr key={idx}>
												<th scope='row'>{idx + 1}</th>
												<td>
													{type._id.substring(0, 10)}
												</td>
												<td>{type.name}</td>
												<td className='text-center'>
													<Link
														to={{
															pathname:
																'/update-package-type',
															state: {
																type: type
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
																// deletePackage(
																// 	pack
																// );
																window.alert(
																	'D'
																);
														}}></i>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				) : (
					'No Package Types found '
				)
			) : (
				'Loading'
			)}
		</div>
	);
};

export default ManagePackageTypes;
