import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { NotificationContext } from '../../context/NotificationContext';
import ViewFeedback from '../../components/FeedbackManagment/ViewFeedback';
import { AuthContext } from '../../context/AuthContext';

const FeedbackManagment = () => {
	const auth = useContext(AuthContext);
	const [isLoading, setIsloading] = useState(true);
	const [feedbacks, setFeedbacks] = useState([]);
	const [searchData, setSearchData] = useState([]);
	const [filter, setFilter] = useState(false);
	const notification = useContext(NotificationContext);
	const search = (e) => {
		if (!e.target.value) {
			setSearchData(feedbacks);
		} else {
			let list = feedbacks.filter(
				(feedback) =>
					feedback.date.includes(e.target.value) ||
					feedback.user.email.includes(e.target.value) ||
					feedback.user.firstName.includes(e.target.value)
			);
			setSearchData(list);
		}
	};

	useEffect(() => {
		async function getData() {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_BASE_URL}/api/feedback`
				);

				if (response.status === 200) {
					setFeedbacks(response.data.feedbacks);
					setSearchData(response.data.feedbacks);
				} else {
					notification.showNotification('No feedbacks yet', true);
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
			let list = feedbacks.filter(
				(feedback) => feedback.user._id === auth.user._id
			);
			setSearchData(list);
		} else {
			setSearchData(feedbacks);
		}
	};
	return (
		<div className='container pb-5'>
			<div className='row justify-content-between my-3'>
				<div className='col-md-5 my-2'>
					<div className='input-group'>
						<div className='form-outline'>
							<input
								placeholder='search feedbacks'
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
				{auth.role === 'user' && (
					<React.Fragment>
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
									My feedbacks only
								</label>
							</div>
						</div>
						<div className='col-md-3 my-2'>
							<Link
								className='btn btn-primary w-100'
								to='/add-feedback'>
								Add feedback
							</Link>
						</div>
					</React.Fragment>
				)}
			</div>
			{!isLoading ? (
				searchData.length > 0 ? (
					<ViewFeedback feedbacks={searchData} />
				) : (
					'no feedbacks found '
				)
			) : (
				'Loading'
			)}
		</div>
	);
};

export default FeedbackManagment;
