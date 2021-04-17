import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { NotificationContext } from '../../../context/NotificationContext';

import './Product.styles.css';

const AddProduct = () => {
	const [product, setProduct] = useState({
		name: '',
		smallDescription: '',
		description: '',
		brand: '',
		category: '',
		price: '',
		qty: ''
	});
	const [isOptionLoading, setIsOptionLoading] = useState(true);
	const [brands, setBrands] = useState([]);
	const [categories, setCategories] = useState([]);
	const [productImage, setProductImage] = useState();
	const [file, setFile] = useState();
	const [signrequest, setSignrequest] = useState();
	const [image, setImgurl] = useState();
	const notification = useContext(NotificationContext);
	const auth = useContext(AuthContext);

	useEffect(() => {
		const fetchBrandsAndCategories = async () => {
			try {
				const res = await axios.get(
					`${process.env.REACT_APP_BASE_URL}/api/product/options`
				);
				if (res.status === 200) {
					setBrands(res.data.brands);
					setCategories(res.data.categories);
					setIsOptionLoading(false);
				} else {
					notification.showNotification(
						'cannot load brands and categories',
						true
					);
				}
			} catch (error) {
				notification.showNotification(
					'server error, cannot load brands and categories',
					true
				);
			}
		};
		fetchBrandsAndCategories();
	}, [notification]);
	const {
		name,
		smallDescription,
		description,
		brand,
		category,
		price,
		qty
	} = product;

	const handleChange = (e) => {
		setProduct({
			...product,
			[e.target.name]: e.target.value
		});
	};

	const onImageChange = async (e) => {
		let file = e.target.files[0];
		if (file.type === 'image/jpeg' || file.type === 'image/png') {
			let ur = URL.createObjectURL(e.target.files[0]);
			setProductImage(ur);
			setFile(file);
			let signed = await axios.get(
				`${process.env.REACT_APP_BASE_URL}/api/aws/signed?filename=${file.name}&filetype=${file.type}`
			);
			if (signed.status !== 200) {
				notification.showNotification(
					'Somthing went wrong please select the image again',
					true
				);
			} else {
				let re = signed.data.signedRequest;
				let reulr = signed.data.url;
				setSignrequest(re);
				setImgurl(reulr);
			}
		} else {
			notification.showNotification(
				'Please upload jpeg or png image',
				true
			);
		}
	};
	function uploadFile(file, signedRequest) {
		const xhr = new XMLHttpRequest();
		if (file) {
			xhr.open('PUT', signedRequest);
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						return true;
					} else {
						notification.showNotification(
							'Somthing went wrong when uploading the image',
							true
						);
						return false;
					}
				}
			};
			xhr.send(file);
		} else {
			notification.showNotification('No file selected', true);
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (file != null) {
				uploadFile(file, signrequest);

				const body = {
					...product,
					image
				};
				const config = {
					headers: {
						'x-auth-token': `${auth.token}`,
						'Content-Type': 'application/json'
					}
				};

				const res = await axios.post(
					`${process.env.REACT_APP_BASE_URL}/api/product`,
					body,
					config
				);
				if (res.status === 201) {
					notification.showNotification(
						'Product created successfully',
						false
					);
					setProduct({
						name: '',
						smallDescription: '',
						description: '',
						brand: '',
						category: '',
						price: '',
						qty: ''
					});
					setFile(null);
					setProductImage(null);
				}
			}
		} catch (error) {}
	};
	return (
		<React.Fragment>
			<div className='container pb-5'>
				<div className='row text-center my-4'>
					<h1>Add Product</h1>
				</div>
				<div className='row'>
					<div className='col-lg-5 col-md-8'>
						{' '}
						<div className='image-upload-container'>
							{productImage ? (
								<img
									src={productImage.replace(/\s+/g, '%20')}
									alt=''
									name='image'
									className='product-upload-preview'
								/>
							) : (
								<label
									htmlFor='file'
									className='image-upload-label '>
									Drag and drop a image or click here
								</label>
							)}

							<input
								required
								onChange={onImageChange}
								type='file'
								className='image-upload-input'
							/>
						</div>
					</div>
					<div className='col-lg-7 col-md-8 '>
						<form onSubmit={handleSubmit}>
							<div className='row'>
								<div className='form-group col-md-6 my-2'>
									<label htmlFor='name'>Product Name</label>
									<input
										required
										type='text'
										className='form-control'
										name='name'
										onChange={handleChange}
										value={name}
										placeholder='Protien powder'
									/>
								</div>
								<div className='form-group col-md-6 my-2'>
									<label htmlFor='price'>Price</label>
									<input
										required
										onChange={handleChange}
										value={price}
										type='number'
										className='form-control'
										name='price'
										placeholder='6750'
									/>
								</div>
							</div>
							<div className='form-group my-2'>
								<label htmlFor='smallDescription'>
									small description
								</label>
								<input
									required
									onChange={handleChange}
									value={smallDescription}
									type='text'
									className='form-control'
									name='smallDescription'
									placeholder='Apartment, studio, or floor'
								/>
							</div>
							<div className='form-group my-2'>
								<label htmlFor='description'>Description</label>
								<textarea
									onChange={handleChange}
									value={description}
									className='form-control'
									name='description'
									placeholder='Description about product'
									rows={3}
								/>
							</div>
							<div className='row my-3'>
								{isOptionLoading ? (
									<div className='col-md-10'>
										loading brands and categories
									</div>
								) : (
									<React.Fragment>
										{categories.length <= 0 ? (
											<div className='form-group col-md-5'>
												<label htmlFor='category'>
													No categories found
												</label>
												<Link
													className='btn btn-primary'
													to='/create-product-category'>
													Please Create Category
												</Link>
											</div>
										) : (
											<div className='form-group col-md-5'>
												<label htmlFor='category'>
													Category
												</label>
												<select
													required
													onChange={handleChange}
													value={category}
													name='category'
													className='form-control'>
													<option hidden>
														Choose category
													</option>
													{categories.map(
														(cat, idx) => {
															return (
																<option
																	value={
																		cat._id
																	}
																	key={idx}>
																	{cat.name}
																</option>
															);
														}
													)}
												</select>
											</div>
										)}
										{brands.length <= 0 ? (
											<div className='form-group col-md-5'>
												<label htmlFor='category'>
													Brand (no brands found)
												</label>
												<Link
													className='btn btn-primary'
													to='/create-product-brand'>
													Please Create brand
												</Link>
											</div>
										) : (
											<div className='form-group col-md-5'>
												<label htmlFor='brand'>
													Brand
												</label>
												<select
													aria-expanded='false'
													name='brand'
													className='form-control'
													onChange={handleChange}
													value={brand}
													required>
													<option hidden>
														Choose brand
													</option>
													{brands.map(
														(brand, idx) => {
															return (
																<option
																	value={
																		brand._id
																	}
																	key={idx}>
																	{brand.name}
																</option>
															);
														}
													)}
												</select>
											</div>
										)}
									</React.Fragment>
								)}

								<div className='form-group col-md-2 '>
									<label htmlFor='qty'>qty</label>
									<input
										required
										onChange={handleChange}
										value={qty}
										type='number'
										className='form-control'
										name='qty'
										min={0}
									/>
								</div>
							</div>
							<div className='row justify-content-end my-2'>
								<div className='col-lg-6 col-md-6'>
									<button
										type='submit'
										className='btn btn-primary my-2 w-100'>
										Add product
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default AddProduct;
