import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import { NotificationContext } from '../../context/NotificationContext';
import ProgressTable from './ProgressTable';

const ViewCustomerProgress = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const currentCustomer = props.location.state.customer;
	const auth = useContext(AuthContext);
	const notification = useContext(NotificationContext);
	const [progress, setProgress] = useState([]);

	useEffect(() => {
		async function getData() {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_BASE_URL}/api/progress/${currentCustomer._id}`
				);

				if (response.status === 200) {
					setProgress(response.data.progress);
				}
			} catch (error) {
				setIsLoading(false);
			}
			setIsLoading(false);
		}

		getData();
	}, [notification, currentCustomer._id]);

	return (
		<div className='container py-5'>
			<h1>
				View {auth.role === 'instructor' ? 'Customer' : 'My'} progress
			</h1>
			<div className='row justify-content-between my-3'>
				<h4>
					Customer : {currentCustomer.firstName}{' '}
					{currentCustomer.lastName}
				</h4>
			</div>
			{!isLoading ? (
				progress.length > 0 ? (
					<>
						<div className='py-4 mb-3'>
							<h3>First day at alpha fitness</h3>
							<ProgressTable
								user={currentCustomer}
								progress={[progress[progress.length - 1]]}
							/>
						</div>
						<h3>Monthly progress</h3>
						<ProgressTable
							user={currentCustomer}
							progress={progress}
						/>
					</>
				) : (
					<div className='row justify-content-center p-4 text-center'>
						<h3 className='text-danger'>
							No progress found for {currentCustomer.firstName}
						</h3>
						{auth.role === 'instructor' && (
							<Link
								className='btn btn-primary w-25'
								to={{
									pathname: '/add-customer-progress',
									state: {
										user: currentCustomer
									}
								}}>
								Add Progress
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

export default ViewCustomerProgress;
