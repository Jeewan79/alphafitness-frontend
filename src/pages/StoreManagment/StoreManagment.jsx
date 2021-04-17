import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { NotificationContext } from '../../context/NotificationContext';

import { AuthContext } from '../../context/AuthContext';
import ViewStore from '../../components/StoreManagment/ViewStore';

const StoreManagment = () => {
	const auth = useContext(AuthContext);
	const [isLoading, setIsloading] = useState(true);
	const [products, setProducts] = useState([]);
	const [searchData, setSearchData] = useState([]);
	const notification = useContext(NotificationContext);

	const search = (e) => {
		if (!e.target.value) {
			setSearchData(products);
		} else {
			let list = products.filter((product) =>
				product.name.includes(e.target.value)
			);
			setSearchData(list);
		}
	};

	useEffect(() => {
		async function getData() {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_BASE_URL}/api/product`
				);

				if (response.status === 200) {
					setProducts(response.data.products);
					setSearchData(response.data.products);
				} else {
					notification.showNotification('No products yet', true);
				}
			} catch (error) {
				//notification.showNotification(error.response.data.msg, true);
			}
			setIsloading(false);
		}

		getData();
	}, [notification]);

	return (
		<div className='container pb-5'>
			<div className='row justify-content-between my-3'>
				<div className='col-md-5 my-2'>
					<div className='input-group'>
						<div className='form-outline'>
							<input
								placeholder='search products'
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
				{auth.role === 'admin' && (
					<React.Fragment>
						<div className='col-md-3 my-2'>
							<Link
								className='btn btn-primary w-100'
								to='/manage-store'>
								Manage store
							</Link>
						</div>
					</React.Fragment>
				)}
			</div>
			{!isLoading ? (
				searchData.length > 0 ? (
					<ViewStore products={searchData} />
				) : (
					'no products found '
				)
			) : (
				'Loading'
			)}
		</div>
	);
};

export default StoreManagment;
