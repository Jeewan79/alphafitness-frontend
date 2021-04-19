import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import UserTable from '../../components/UserManagement/UserTable';
import { NotificationContext } from '../../context/NotificationContext';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const UserManagement = () => {
	const [isLoading, setIsloading] = useState(true);
	const [users, setUsers] = useState([]);
	const [searchData, setSearchData] = useState([]);
	const notification = useContext(NotificationContext);
	const doc = new jsPDF();

	const generateReport = () => {
		doc.text(`Customers of Alpha fitness gym`, 30, 10);

		let array = [];
		users.map((user, index) => {
			let row = [];
			row.push(index + 1);
			row.push(user.firstName);
			row.push(user.lastName);
			row.push(user.gender);
			row.push(user.email);
			row.push(user.mobile);
			row.push(user.package.name);
			array.push(row);
			return row;
		});

		doc.autoTable({
			head: [
				[
					'#',
					'First Name',
					'Last Name',
					'Gender',
					'Email',
					'Mobile',
					'Package'
				]
			],

			body: array
		});

		doc.save('customers.pdf');
	};
	const search = (e) => {
		if (!e.target.value) {
			setSearchData(users);
		} else {
			let list = users.filter(
				(user) =>
					user.email.includes(e.target.value) ||
					user.firstName.includes(e.target.value)
			);
			setSearchData(list);
		}
	};

	useEffect(() => {
		async function getData() {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_BASE_URL}/api/auth`
				);

				if (response.status === 200) {
					setUsers(response.data.users);
					setSearchData(response.data.users);
				} else {
					notification.showNotification('No users yet', true);
				}
			} catch (error) {
				notification.showNotification(error.response.data.msg, true);
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
								placeholder='search customer'
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
						to='/create-customer'>
						Add Customer
					</Link>
				</div>
			</div>
			{!isLoading ? (
				searchData.length > 0 ? (
					<>
						<UserTable customers={searchData} />

						<div className='row text-end justify-content-end'>
							<div className='col-md-4 mt-4'>
								<button
									className='btn btn-success'
									onClick={generateReport}>
									Generate report
								</button>
							</div>
						</div>
					</>
				) : (
					'no users found '
				)
			) : (
				'Loading'
			)}
		</div>
	);
};

export default UserManagement;
