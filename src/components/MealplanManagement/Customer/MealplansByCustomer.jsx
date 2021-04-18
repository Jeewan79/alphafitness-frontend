import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { NotificationContext } from '../../../context/NotificationContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import CustomerMealplansTable from './CustomerMealplansTable';

const MealplansByCustomer = (props) => {
	const user = props.location.state.customer;
	const auth = useContext(AuthContext);
	const [isLoading, setIsloading] = useState(true);
	const [mealplans, setmealplans] = useState([]);
	const [searchData, setSearchData] = useState([]);
	const doc = new jsPDF();

	const genmealplanReport = () => {
		doc.text(`mealplans of ${user.firstName} ${user.lastName}`, 10, 10);

		let array = [];
		mealplans.map((mealplan, idx) => {
			let item = [];
			item.push(idx + 1);
			item.push(mealplan.name);
			item.push(mealplan.category);
			item.push(mealplan.description);

			array.push(item);
			return item;
		});
		doc.autoTable({
			head: [['#', 'mealplan', 'type', 'Description']],

			body: array
		});

		doc.save(`${user.firstName}-mealplans.pdf`);
	};

	const notification = useContext(NotificationContext);
	const search = (e) => {
		if (!e.target.value) {
			setSearchData(mealplans);
		} else {
			let list = mealplans.filter((mealplan) =>
				mealplan.name.toLowerCase().includes(e.target.value)
			);
			setSearchData(list);
		}
	};

	useEffect(() => {
		async function getData() {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_BASE_URL}/api/mealplan/${user._id}`
				);

				if (response.status === 200) {
					setmealplans(response.data.mealplans);
					setSearchData(response.data.mealplans);
				} else {
					notification.showNotification('No mealplans yet', true);
				}
			} catch (error) {
				notification.showNotification('please try again', true);
			}
			setIsloading(false);
		}

		getData();
	}, [notification, user._id]);

	return (
		<div className='container pb-5 pt-5'>
			<h3>
				{auth.role === 'user' ? 'My' : `${user.firstName}'s`} mealplans{' '}
			</h3>
			<div className='row justify-content-between my-3'>
				{!isLoading && mealplans.length > 0 && (
					<div className='col-md-6 my-2'>
						<div className='input-group'>
							<div className='form-outline'>
								<input
									placeholder='search mealplans'
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
						<h3 className='pt-3'>mealplans of {user.firstName}</h3>
						<CustomerMealplansTable
							mealplans={searchData}
							user={user}
						/>
						<div className='col-md-12 text-end'>
							<button
								className='btn btn-primary mt-4 '
								onClick={genmealplanReport}>
								Generate mealplans report
							</button>
						</div>
					</>
				) : (
					<div className='row justify-content-center p-4 text-center'>
						<h3 className='text-danger'>No mealplans found</h3>
						{auth.role === 'instructor' && (
							<Link
								className='btn  btn-outline-primary w-50'
								to='/manage-mealplans'>
								Assign mealplan to {user.firstName}
							</Link>
						)}
					</div>
				)
			) : (
				'Loading'
			)}
		</div>
	);
};

export default MealplansByCustomer;
