import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { NotificationContext } from '../../context/NotificationContext';
import { AuthContext } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import MealplansTable from '../../components/MealplanManagement/MealplansTable';

const MealplanManagement = () => {
	const auth = useContext(AuthContext);
	const [isLoading, setIsloading] = useState(true);
	const [mealplans, setMealplans] = useState([]);
	const [searchData, setSearchData] = useState([]);
	const [filter, setFilter] = useState(false);
	const notification = useContext(NotificationContext);

	const doc = new jsPDF();
	const genMyMealPlans = () => {
		doc.text(
			`My ( ${auth.user.firstName} ${auth.user.lastName} ) Mealplans of Alpha fitness gym`,
			10,
			10
		);
		let myWorkouts = mealplans.filter(
			(mealplan) => mealplan.createdBy._id === auth.user._id
		);
		let array = [];

		myWorkouts.map((mealplan, idx) => {
			let item = [];
			item.push(idx + 1);
			item.push(mealplan.name);
			item.push(mealplan.category);
			item.push(mealplan.description);

			array.push(item);
			return item;
		});
		doc.autoTable({
			head: [['#', 'Name', 'Type', 'Description']],

			body: array
		});

		doc.save(`${auth.user.firstName}-mealplans.pdf`);
	};
	const genAllMealPlans = () => {
		doc.text(`All available mealplans`, 10, 10);

		let array = [];
		mealplans.map((mealplan, idx) => {
			let item = [];
			item.push(idx + 1);
			item.push(mealplan.name);
			item.push(mealplan.category);
			item.push(mealplan.description);
			item.push(mealplan.createdBy.firstName);

			array.push(item);
			return item;
		});
		doc.autoTable({
			head: [['#', 'Name', 'Type', 'Description', 'Created by']],

			body: array
		});

		doc.save(`All mealplans.pdf`);
	};

	const search = (e) => {
		if (!e.target.value) {
			setSearchData(mealplans);
		} else {
			let list = mealplans.filter(
				(mealplan) =>
					mealplan.name.toLowerCase().includes(e.target.value) ||
					mealplan.category.toLowerCase().includes(e.target.value)
			);
			setSearchData(list);
		}
	};

	useEffect(() => {
		async function getData() {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_BASE_URL}/api/mealplan`
				);

				if (response.status === 200) {
					setMealplans(response.data.mealplans);
					setSearchData(response.data.mealplans);
				} else {
					notification.showNotification('No mealplans yet', true);
				}
			} catch (error) {
				notification.showNotification(error.response.data.msg, true);
			}
			setIsloading(false);
		}

		getData();
	}, [notification]);

	const filterMine = (e) => {
		setFilter(!filter);

		if (e.target.value === 'false') {
			let list = mealplans.filter(
				(mealplan) => mealplan.createdBy._id === auth.user._id
			);
			setSearchData(list);
		} else {
			setSearchData(mealplans);
		}
	};
	return (
		<div className='container pb-5 pt-5'>
			<h3>Manage mealplans</h3>
			<div className='row justify-content-between my-3'>
				{!isLoading && searchData != null && (
					<div className='col-md-3 my-2'>
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
				{auth.role === 'instructor' && (
					<React.Fragment>
						{!isLoading &&
							searchData != null &&
							searchData.length > 0 && (
								<>
									<div className='col-md-3 my-2'>
										<div className='form-check'>
											<input
												className='form-check-input'
												type='checkbox'
												value={filter}
												onChange={filterMine}
												id='defaultCheck1'
											/>

											<label
												className='form-check-label'
												htmlFor='defaultCheck1'>
												My mealplans only
											</label>
										</div>
									</div>
								</>
							)}
						<div className='col-md-3 my-2 '>
							<Link
								className='btn btn-primary w-100'
								to='/create-mealplan'>
								Add MealPlan
							</Link>
						</div>
						<div className='col-md-3 my-2 '>
							<Link
								className='btn btn-primary w-100'
								to='/View-mealplan-clients'>
								View my clients mealplans
							</Link>
						</div>
					</React.Fragment>
				)}
			</div>
			{!isLoading ? (
				searchData != null && searchData.length > 0 ? (
					<>
						<hr />
						<h3 className='pt-3'>
							{!filter ? 'All' : 'My'} mealplans
						</h3>

						<MealplansTable mealplans={searchData} />

						<div className='row mt-5 justify-content-end text-end'>
							<div className='col-md-6'></div>
							<div className='col md-3'>
								<button
									className='btn btn-primary'
									onClick={genMyMealPlans}>
									Generate My mealplans report
								</button>
							</div>
							<div className='col md-3'>
								<button
									className='btn btn-outline-primary'
									onClick={genAllMealPlans}>
									Generate All mealplans report
								</button>
							</div>
						</div>
					</>
				) : (
					<div className='row justify-content-center p-4 text-center'>
						<h3 className='text-danger'>No mealplans found</h3>
						{auth.role === 'instructor' && (
							<Link
								className='btn  btn-outline-primary w-25'
								to='/create-mealplan'>
								Create mealplan
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

export default MealplanManagement;
