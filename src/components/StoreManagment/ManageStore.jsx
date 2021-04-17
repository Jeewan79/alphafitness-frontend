import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import AdminProductView from './Products/AdminProductView';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const ManageStore = () => {
	const auth = useContext(AuthContext);
	const [isLoading, setIsloading] = useState(true);
	const [products, setProducts] = useState([]);
	const [searchData, setSearchData] = useState([]);
	const notification = useContext(NotificationContext);
	const doc = new jsPDF();
	const generateProductsReport = () => {
		doc.text(`Products report`, 10, 10);

		let array = [];
		products.map((product, i) => {
			let p = [];
			p.push(i + 1);
			p.push(product.name);
			p.push(product.category.name);
			p.push(product.brand.name);
			p.push(product.smallDescription);
			p.push(product.price);
			p.push(product.qty);
			p.push(product.baseqty - product.qty);
			p.push((product.baseqty - product.qty) * product.price);
			array.push(p);
			return p;
		});

		doc.autoTable({
			head: [
				[
					'#',
					'Name',
					'Category',
					'Brand',
					'Description',
					'Price',
					'Available quantity',
					'Sold Quantity',
					'Sold Items price'
				]
			],

			body: array
		});

		doc.save(`reportofproducts.pdf`);
	};
	const search = (e) => {
		if (!e.target.value) {
			setSearchData(products);
		} else {
			let list = products.filter(
				(product) =>
					product.name.toLowerCase().includes(e.target.value) ||
					product._id.includes(e.target.value) ||
					product.brand.name.toLowerCase().includes(e.target.value)
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
				}
			} catch (error) {}
			setIsloading(false);
		}
		getData();
	}, [notification]);

	const deleteProduct = async (product) => {
		try {
			const response = await axios.delete(
				`${process.env.REACT_APP_BASE_URL}/api/product/delete`,
				{
					headers: {
						'x-auth-token': `${auth.token}`,
						'Content-Type': 'application/json'
					},
					data: {
						id: product._id
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
	return (
		<div className='container pb-5'>
			<div className='row justify-content-between my-3'>
				<h2>Manage Store</h2>
				<div className='col-md-3 my-2'>
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

				<div className='col-md-3 my-2'>
					<Link className='btn btn-primary w-100' to='/add-product'>
						+ Add Product
					</Link>
				</div>

				<div className='col-md-3 my-2'>
					<Link
						className='btn btn-primary w-100'
						to='/manage-product-category'>
						Manage Categories
					</Link>
				</div>
				<div className='col-md-3 my-2'>
					<Link
						className='btn btn-primary w-100'
						to='/manage-product-brands'>
						Manage Brands
					</Link>
				</div>
			</div>

			<div className='row justify-content-center'>
				<div className='col-md-8'>
					{!isLoading ? (
						searchData.length > 0 ? (
							<div className='row justify-content-between justify-content-md-start'>
								{searchData.map((product, index) => {
									return (
										<AdminProductView
											product={product}
											deleteProduct={deleteProduct}
											key={index}></AdminProductView>
									);
								})}
								<div className='row justify-content-end'>
									<div className='col-md-4 mt-4'>
										<button
											className='btn btn-primary w-100'
											onClick={generateProductsReport}>
											Generate report
										</button>
									</div>
								</div>
							</div>
						) : (
							'no products found '
						)
					) : (
						'Loading'
					)}
				</div>
			</div>
		</div>
	);
};

export default ManageStore;
