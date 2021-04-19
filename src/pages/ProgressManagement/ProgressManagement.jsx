import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import ProgressOverviewTable from '../../components/ProgressManagement/ProgressOverviewTable';
import { NotificationContext } from '../../context/NotificationContext';

const ProgressManagement = () => {
	const [isLoading, setIsloading] = useState(true);
	const [users, setUsers] = useState([]);
	const [searchData, setSearchData] = useState([]);
	const notification = useContext(NotificationContext);
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
		<div className='container py-5'>
			<h1>Manage Customer progress</h1>
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
			</div>
			{!isLoading ? (
				searchData.length > 0 ? (
					<ProgressOverviewTable customers={searchData} />
				) : (
					'no users found '
				)
			) : (
				'Loading'
			)}
		</div>
	);
};

export default ProgressManagement;
