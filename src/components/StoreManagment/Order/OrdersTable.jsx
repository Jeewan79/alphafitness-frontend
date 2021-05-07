import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';

const OrdersTable = ({ orders }) => {
	const auth = useContext(AuthContext);

	return (
		<div className='row'>
			<div className='col-md-12'>
				<table className='table'>
					<thead>
						<tr>
							<th scope='col'>#</th>
							<th scope='col'>Date</th>
							<th scope='col'>Product</th>
							<th scope='col'>Image</th>
							<th scope='col'>Qty</th>
							<th scope='col'>Total LKR </th>
							<th scope='col'>Address</th>
							{auth.role === 'admin' && (
								<th scope='col'>Purchased By</th>
							)}
						</tr>
					</thead>
					<tbody>
						{orders.map((order, idx) => {
							return (
								<tr key={idx}>
									<th scope='row'>{idx + 1}</th>
									<td>
										{order.purchaseDate.substring(0, 10)}
									</td>
									<td>{order.product.name}</td>
									<td>
										<img
											alt='ordered product'
											src={order.product.image.replace(
												/\s+/g,
												'%20'
											)}
											style={{ width: '150px' }}
										/>
									</td>
									<td>{order.qty}</td>
									<td>
										{(
											order.qty * order.product.price
										).toFixed(2)}
									</td>

									<td>{order.address}</td>
									{auth.role === 'admin' && (
										<td>{order.user.firstName}</td>
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

export default OrdersTable;
