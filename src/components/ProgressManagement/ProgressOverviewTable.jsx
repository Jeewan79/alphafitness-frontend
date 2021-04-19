import React from 'react';
import { Link } from 'react-router-dom';

const ProgressOverviewTable = ({ customers }) => {
	return (
		<div className='row'>
			<div className='col-md-12'>
				<table className='table'>
					<thead>
						<tr>
							<th scope='col'>#</th>
							<th scope='col'>First Name</th>
							<th scope='col'>Email</th>
							<th scope='col'>View Progress</th>
							<th scope='col'>Add Progress</th>
						</tr>
					</thead>
					<tbody>
						{customers.map((customer, idx) => {
							return (
								<tr key={idx}>
									<th scope='row'>{idx + 1}</th>
									<td>{customer.firstName}</td>
									<td>{customer.email}</td>
									<td className=''>
										<Link
											to={{
												pathname:
													'/view-customer-progress',
												state: {
													customer: customer
												}
											}}>
											<i
												className='fas fa-eye pe-3'
												style={{
													fontSize: '22px',
													color: 'green'
												}}></i>
										</Link>
									</td>
									<td className=''>
										<Link
											to={{
												pathname:
													'/add-customer-progress',
												state: {
													user: customer
												}
											}}>
											<i
												className='fas fa-plus pe-3'
												style={{
													fontSize: '22px'
												}}></i>
										</Link>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ProgressOverviewTable;
