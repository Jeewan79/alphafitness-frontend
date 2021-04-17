import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { NotificationContext } from '../../../context/NotificationContext';

const ManageBrands = () => {
	const auth = useContext(AuthContext);
	const [isLoading, setIsloading] = useState(true);
	const [brands, setBrands] = useState([]);
	const [searchData, setSearchData] = useState([]);
	const notification = useContext(NotificationContext);

	const search = (e) => {
		if (!e.target.value) {
			setSearchData(brands);
		} else {
			let list = brands.filter(
				(brand) =>
					brand.name.toLowerCase().includes(e.target.value) ||
					brand.createdDate.includes(e.target.value) ||
					brand.createdBy.email.includes(e.target.value) ||
					brand.createdBy.firstName.includes(e.target.value)
			);
			setSearchData(list);
		}
	};

	const deleteBrand = async (brand) => {
		try {
			const response = await axios.delete(
				`${process.env.REACT_APP_BASE_URL}/api/product/brand/delete`,
				{
					headers: {
						'x-auth-token': `${auth.token}`,
						'Content-Type': 'application/json'
					},
					data: {
						id: brand._id
					}
				}
			);

			if (response.status === 200) {
				notification.showNotification(response.data.msg, false);
			} else {
				notification.showNotification(response.data.msg, true);
			}
		} catch (error) {
			notification.showNotification(error.response.data.msg, true);
		}
	};

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_BASE_URL}/api/product/brand`
				);

				if (response.status === 200) {
					setBrands(response.data.brands);
					setSearchData(response.data.brands);
				}
			} catch (error) {}
			setIsloading(false);
		}
		fetchData();
	}, [notification]);

	return (
		<div className='container pb-5'>
			<div className='row justify-content-between my-3'>
				<div className='col-md-3 my-2'>
					<div className='input-group'>
						<div className='form-outline'>
							<input
								placeholder='search brands'
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
				</div>

				<div className='col-md-3 my-2'>
					<Link
						className='btn btn-primary w-100'
						to='/create-product-brand'>
						+ Add a Brand
					</Link>
				</div>
			</div>

			{!isLoading ? (
				searchData.length > 0 ? (
					<table className='table table-dark'>
						<thead>
							<tr>
								<th scope='col'>#</th>
								<th scope='col'>Brand Name</th>
								<th scope='col'>Created By</th>
								<th scope='col'>Created Date</th>
								<th scope='col'>Manage</th>
							</tr>
						</thead>
						<tbody>
							{searchData.map((brand, idx) => {
								return (
									<tr key={idx}>
										<th scope='row'>{idx + 1}</th>
										<td>{brand.name}</td>
										<td>{brand.createdBy.firstName}</td>
										<td>
											{brand.createdDate.substring(0, 10)}
										</td>
										<td>
											<React.Fragment>
												<Link
													to={{
														pathname:
															'/update-product-brand',
														state: {
															brand: brand
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
																'Are you sure you need to delete this brand? Brand cannot be deleted if ther are product under the brand'
															)
														)
															deleteBrand(brand);
													}}></i>
											</React.Fragment>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				) : (
					'no brands found '
				)
			) : (
				'Loading'
			)}
		</div>
	);
};

export default ManageBrands;
