import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { NotificationContext } from '../../../context/NotificationContext';
import CustomerTable from './CustomerTable';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ViewClientsByInstructor = () => {
	const auth = useContext(AuthContext);
	const [isLoading, setIsloading] = useState(true);
	const [customers, setCustomers] = useState([]);
	const [searchData, setSearchData] = useState([]);

	const notification = useContext(NotificationContext);
	const doc = new jsPDF();
	const genMyCustomers = () => {
		doc.text(
			`Customers of ${auth.user.firstName} ${auth.user.lastName}`,
			10,
			10
		);

		let array = [];
		customers.map((customer, idx) => {
			let item = [];
			item.push(idx + 1);
			item.push(customer.firstName + ' ' + customer.lastName);
			item.push(customer.email);
			item.push(customer.gender);
			item.push(customer.mobile);

			array.push(item);
			return item;
		});
		doc.autoTable({
			head: [['#', 'Name', 'Email', 'Gender', 'Mobile']],

			body: array
		});

		doc.save(`${auth.user.firstName}-customers.pdf`);
	};
	const search = (e) => {
		if (!e.target.value) {
			setSearchData(customers);
		} else {
			let list = customers.filter(
				(customer) =>
					customer.firstName.toLowerCase().includes(e.target.value) ||
					customer.email.toLowerCase().includes(e.target.value)
			);
			setSearchData(list);
		}
	};

	useEffect(() => {
		async function getData() {
			try {
				const config = {
					headers: {
						'x-auth-token': `${auth.token}`,
						'Content-Type': 'application/json'
					}
				};
				const response = await axios.get(
					`${process.env.REACT_APP_BASE_URL}/api/workout/getusers`,
					config
				);

				if (response.status === 200) {
					setCustomers(response.data.users);
					setSearchData(response.data.users);
				} else {
					notification.showNotification('No customers yet', true);
				}
			} catch (error) {
				notification.showNotification(error.response.data.msg, true);
			}
			setIsloading(false);
		}

		getData();
	}, [notification, auth.token]);

	return (
		<div className='container pb-5 pt-5'>
			<h3>Manage Clients</h3>
			<div className='row justify-content-between my-3'>
				{!isLoading && searchData != null && (
					<div className='col-md-6 my-2'>
						<div className='input-group'>
							<div className='form-outline'>
								<input
									placeholder='search customers'
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
				)}
			</div>
			{!isLoading ? (
				searchData != null && searchData.length > 0 ? (
					<>
						<hr />
						<h3 className='pt-3'>My Clients</h3>

						<CustomerTable customers={searchData} />

						<button
							className='btn btn-primary float-end mt-4'
							onClick={genMyCustomers}>
							Generate my Clients report
						</button>
					</>
				) : (
					<div className='row justify-content-center p-4 text-center'>
						<h3 className='text-danger'>No Clients found</h3>
					</div>
				)
			) : (
				'Loading'
			)}
		</div>
	);
};

export default ViewClientsByInstructor;
