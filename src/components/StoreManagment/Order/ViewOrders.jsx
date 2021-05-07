import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import OrdersTable from './OrdersTable';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const ViewOrders = () => {
	const [isLoading, setIsLoading] = useState(true);
	const auth = useContext(AuthContext);
	const [orders, setOrders] = useState([]);
	const doc = new jsPDF();

	const generateReport = () => {
		doc.text(`Orders of Alpha fitness gym`, 30, 10);

		let array = [];
		orders.map((order, index) => {
			let row = [];
			row.push(index + 1);
			row.push(order.purchaseDate.substring(0, 10));
			row.push(order.product.name);
			row.push(order.qty);
			row.push(order.qty * order.product.price);
			row.push(order.address);
			row.push(
				auth.role === 'admin'
					? order.user.email
					: order.product.smallDescription
			);

			array.push(row);
			return row;
		});

		doc.autoTable({
			head: [
				[
					'#',
					'Date',
					'Product',
					'Qty',
					'Total',
					'Address',
					auth.role === 'admin'
						? 'Purchased By'
						: 'Product Description'
				]
			],

			body: array
		});

		doc.save('Orders.pdf');
	};
	useEffect(() => {
		async function fetchOrders() {
			try {
				const config = {
					headers: {
						'x-auth-token': `${auth.token}`,
						'Content-Type': 'application/json'
					}
				};
				let req =
					auth.role === 'admin' ? 'api/order/all' : 'api/order/';

				const res = await axios.get(
					`${process.env.REACT_APP_BASE_URL}/${req}`,
					config
				);
				if (res.status === 200) {
					setOrders(res.data.orders);
				}
			} catch (error) {}
			setIsLoading(false);
		}
		fetchOrders();
	}, [auth.role, auth.token]);
	return (
		<div className='container pb-5'>
			<div className='row justify-content-between my-3'>
				<div className='col-md-5 my-2'>
					<h3>View orders</h3>
				</div>
			</div>
			{!isLoading ? (
				orders.length > 0 ? (
					<>
						<OrdersTable orders={orders} />
						<div className='row justify-content-end text-end'>
							<div className='col-md-4 mt-4'>
								<button
									className='btn btn-primary'
									onClick={generateReport}>
									Generate report
								</button>
							</div>
						</div>
					</>
				) : (
					'no orders found '
				)
			) : (
				'Loading'
			)}
		</div>
	);
};

export default ViewOrders;
