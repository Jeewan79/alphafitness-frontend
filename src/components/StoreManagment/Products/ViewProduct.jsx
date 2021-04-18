import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { NotificationContext } from '../../../context/NotificationContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ViewProduct = () => {
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [product, setProduct] = useState();
	const notification = useContext(NotificationContext);
	const auth = useContext(AuthContext);
	const doc = new jsPDF();
	const generateProductReport = () => {
		doc.text(`Product - ${product.name} report`, 10, 10);

		doc.autoTable({
			head: [
				[
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

			body: [
				[
					product.name,
					product.category.name,
					product.brand.name,
					product.smallDescription,
					product.price,
					product.qty,
					product.baseqty - product.qty,
					(product.baseqty - product.qty) * product.price
				]
			]
		});

		doc.save(`reportof${product.name}.pdf`);
	};
	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const res = await axios.get(
					`${process.env.REACT_APP_BASE_URL}/api/product/${id}`
				);
				setLoading(false);
				if (res.status !== 200) {
					notification.showNotification(
						'cannot load the product',
						true
					);

					setTimeout(() => {
						window.history.back();
					}, [2000]);
				}
				setProduct(res.data.product);
			} catch (error) {
				setLoading(false);
				notification.showNotification('cannot load the product', true);
				setTimeout(() => {
					window.history.back();
				}, [2000]);
			}
		};
		fetchProduct();
	}, [id, notification]);

	return (
		<div className='row'>
			{loading
				? 'loading'
				: product != null && (
						<React.Fragment>
							<div className='container'>
								<div className='row text-center my-4'>
									<h1>View Product</h1>
								</div>
								<div className='row'>
									<div className='col-lg-5 col-md-8'>
										<div
											className='image-view-container'
											style={{
												backgroundImage: `url(${product.image.replace(
													/\s+/g,
													'%20'
												)})`
											}}></div>
									</div>
									<div className='col-lg-7 col-md-8 '>
										<div className='row'>
											<div className='form-group col-md-12 my-2'>
												<h3>
													{product.name.toUpperCase()}{' '}
													-{' '}
													{product._id.substring(
														0,
														6
													)}
												</h3>{' '}
											</div>
										</div>
										<div className='col-md-6 my-2'>
											<p>{product.smallDescription}</p>
										</div>
										<div className='my-2'>
											Brand : {product.brand.name}
										</div>
										<div className='my-2'>
											<h4>Price : LKR {product.price}</h4>
										</div>
										<div className='row my-2'>
											{product.qty > 0 ? (
												<span className='available-text'>
													Availabl now ({product.qty}{' '}
													items)
												</span>
											) : (
												<span className='unavailable-text'>
													Out of stock
												</span>
											)}
										</div>
										<div className='row my-2'>
											<p>{product.description} </p>
										</div>
										<div className='row justify-content-start my-2'>
											<div className='col-lg-6 col-md-6'>
												{auth.isLoggedIn ? (
													auth.role === 'user' ? (
														<Link
															to={{
																pathname:
																	'/place-order',
																state: {
																	item: product
																}
															}}
															className='btn btn-primary my-2 w-100'>
															Buy now
														</Link>
													) : (
														auth.role ===
															'admin' && (
															<>
																<Link
																	to={{
																		pathname:
																			'/update-product',
																		state: {
																			product: product
																		}
																	}}
																	className='btn btn-primary my-2 w-100'>
																	update this
																	product
																</Link>
																<button
																	className='btn btn-primary my-2 w-100'
																	onClick={
																		generateProductReport
																	}>
																	Generate
																	report
																</button>
															</>
														)
													)
												) : (
													<Link
														to='/login'
														className='btn btn-primary my-2 w-100'>
														Login to buy
													</Link>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</React.Fragment>
				  )}
		</div>
	);
};

export default ViewProduct;
