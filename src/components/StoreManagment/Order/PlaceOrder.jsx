import axios from 'axios';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { NotificationContext } from '../../../context/NotificationContext';

const PlaceOrder = (props) => {
	const item = props.location.state.item;
	const auth = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(false);
	const notification = useContext(NotificationContext);
	const [defaultAddress, setDefaultAddress] = useState(true);
	const [order, setOrder] = useState({
		productId: item._id,
		qty: 1,
		address: auth.user.address
	});
	const { qty, address } = order;
	const customAddress = (e) => {
		setDefaultAddress(!defaultAddress);
		setOrder({
			...order,
			address: !defaultAddress ? auth.user.address : ''
		});
	};

	const onChange = (e) => {
		if (e.target.name === 'address') setDefaultAddress(false);
		setOrder({
			...order,
			[e.target.name]: e.target.value
		});
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const config = {
				headers: {
					'x-auth-token': `${auth.token}`,
					'Content-Type': 'application/json'
				}
			};
			const response = await axios.post(
				`${process.env.REACT_APP_BASE_URL}/api/order`,
				order,
				config
			);
			if (response.status === 201) {
				notification.showNotification(
					'Order placed successfully',
					false
				);
				setIsLoading(false);
				setTimeout(() => {
					window.location.replace('/view-orders');
				}, [1000]);
				return;
			}
		} catch (error) {
			notification.showNotification('Order placement failed', true);
		}
		setIsLoading(false);
	};
	return (
		<>
			{isLoading ? (
				'Placing order'
			) : (
				<div className='row my-5'>
					<div className='col-md-4 order-md-2 mb-4'>
						<h4 className='d-flex justify-content-between align-items-center mb-3'>
							<span className='text-muted'>Your Order</span>
							<span className='badge badge-secondary badge-pill'>
								3
							</span>
						</h4>
						<ul className='list-group mb-3'>
							<li className='list-group-item d-flex justify-content-between lh-condensed'>
								<div>
									<h6 className='my-0'>{item.name}</h6>
									<small className='text-muted'>
										{item.smallDescription}
									</small>
								</div>
								<span className='text-muted'>$12</span>
							</li>
							<li className='list-group-item d-flex justify-content-between lh-condensed'>
								<div>
									<h6 className='my-0'>Order Quantity</h6>
									<small className=' available-text'>
										{item.qty} items available
									</small>
								</div>
								<div className='col-md-2 mb-3'>
									<input
										type='number'
										className='form-control'
										name='qty'
										placeholder=''
										value={qty}
										max={item.qty}
										min={1}
										onChange={onChange}
										required
									/>
								</div>
							</li>
							<li className='list-group-item d-flex justify-content-between'>
								<span>Total (USD)</span>
								<strong>LKR {qty * item.price}</strong>
							</li>
						</ul>
					</div>

					<div className='col-md-8 order-md-1'>
						<h4 className='mb-3'>Billing address</h4>
						<form className='needs-validation' novalidate=''>
							<div className='row'>
								<div className='col-md-6 mb-3'>
									<label htmlFor='firstName'>
										First name
									</label>
									<input
										type='text'
										className='form-control'
										name='firstName'
										value={auth.user.firstName}
										required
									/>
								</div>
								<div className='col-md-6 mb-3'>
									<label htmlFor='lastName'>Last name</label>
									<input
										type='text'
										className='form-control'
										id='lastName'
										value={auth.user.lastName}
										required=''
									/>
								</div>
							</div>

							<div className='mb-3'>
								<label htmlFor='email'>Email</label>
								<input
									type='email'
									className='form-control'
									naem='email'
									value={auth.user.email}
								/>
							</div>

							<div className='mb-3'>
								<label htmlFor='address'>Address</label>
								<input
									type='text'
									className='form-control'
									name='address'
									value={address}
									onChange={onChange}
									required
								/>
							</div>

							<hr className='mb-4' />
							<div className='custom-control custom-checkbox'>
								<input
									type='checkbox'
									className='custom-control-input mx-2'
									name='same-address'
									checked={defaultAddress}
									value={defaultAddress}
									onChange={customAddress}
								/>
								<label
									className='custom-control-label'
									htmlFor='same-address'>
									Use my default address
								</label>
							</div>
							<hr className='mb-4' />

							<h4 className='mb-3'>Payment</h4>

							<div className='d-block my-3'>
								<h6>
									We only support cash on delivery method for
									now
								</h6>
							</div>
							<hr className='mb-4' />

							<button
								className='btn btn-primary btn-lg btn-block'
								onClick={onSubmit}>
								place order
							</button>
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default PlaceOrder;
