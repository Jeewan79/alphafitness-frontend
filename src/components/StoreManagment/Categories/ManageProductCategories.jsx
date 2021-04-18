import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { NotificationContext } from '../../../context/NotificationContext';

const ManageProductCategories = () => {
	const auth = useContext(AuthContext);
	const [isLoading, setIsloading] = useState(true);
	const [categories, setBrands] = useState([]);
	const [searchData, setSearchData] = useState([]);
	const notification = useContext(NotificationContext);

	const search = (e) => {
		if (!e.target.value) {
			setSearchData(categories);
		} else {
			let list = categories.filter(
				(category) =>
					category.name.toLowerCase().includes(e.target.value) ||
					category.createdDate.includes(e.target.value) ||
					category.createdBy.email.includes(e.target.value) ||
					category.createdBy.firstName.includes(e.target.value)
			);
			setSearchData(list);
		}
	};
	const getData = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_BASE_URL}/api/product/category`
			);

			if (response.status === 200) {
				setBrands(response.data.categories);
				setSearchData(response.data.categories);
			} else {
				notification.showNotification('No categories yet', true);
			}
		} catch (error) {
			//notification.showNotification(error.response.data.msg, true);
		}
		setIsloading(false);
	};
	const deleteCategory = async (category) => {
		try {
			const response = await axios.delete(
				`${process.env.REACT_APP_BASE_URL}/api/product/category/delete`,
				{
					headers: {
						'x-auth-token': `${auth.token}`,
						'Content-Type': 'application/json'
					},
					data: {
						id: category._id
					}
				}
			);

			if (response.status === 200) {
				getData();
				notification.showNotification(response.data.msg, false);
			} else {
				notification.showNotification(response.data.msg, true);
			}
		} catch (error) {
			notification.showNotification(error.response.data.msg, true);
		}
	};

	useEffect(() => {
		async function fetch() {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_BASE_URL}/api/product/category`
				);

				if (response.status === 200) {
					setBrands(response.data.categories);
					setSearchData(response.data.categories);
				}
			} catch (error) {}
			setIsloading(false);
		}
		fetch();
	}, [notification]);

	return (
		<div className='container pb-5'>
			<div className='row justify-content-between my-3'>
				<div className='col-md-3 my-2'>
					<div className='input-group'>
						<div className='form-outline'>
							<input
								placeholder='search categories'
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
						to='/create-product-category'>
						+ Add a Category
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
							{searchData.map((category, idx) => {
								return (
									<tr key={idx}>
										<th scope='row'>{idx + 1}</th>
										<td>{category.name}</td>
										<td>{category.createdBy.firstName}</td>
										<td>
											{category.createdDate.substring(
												0,
												10
											)}
										</td>
										<td>
											<React.Fragment>
												<Link
													to={{
														pathname:
															'/update-product-category',
														state: {
															category: category
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
																'Are you sure you need to delete this category? Category cannot be deleted if there are product in the category'
															)
														)
															deleteCategory(
																category
															);
													}}></i>
											</React.Fragment>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				) : (
					'no categories found '
				)
			) : (
				'Loading'
			)}
		</div>
	);
};

export default ManageProductCategories;
