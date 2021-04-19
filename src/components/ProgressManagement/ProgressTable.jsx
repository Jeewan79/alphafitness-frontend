import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { NotificationContext } from '../../context/NotificationContext';

const ProgressTable = ({ user, progress }) => {
	const auth = useContext(AuthContext);
	const notification = useContext(NotificationContext);
	const doc = new jsPDF();
	const genPdf = () => {
		doc.text(`Progress of ${user.firstName} ${user.lastName}`, 10, 10);
		// doc.autoTable({ html: '#my-table' });

		let array = [];
		progress.map((p, idx) => {
			let item = [];
			item.push(p.date.substring(0, 10));
			item.push(p.height);
			item.push(p.weight);
			item.push(p.bicep);
			item.push(p.thigh);
			item.push(p.hips);
			item.push(p.chest);
			item.push(p.arm);
			item.push(p.shoulder);
			item.push(calculateBmi(p.height, p.weight));
			array.push(item);
			return item;
		});

		doc.autoTable({
			head: [
				[
					'Date',
					'Height (cm) ',
					'Weight (kg)',
					'Bicep (cm)',
					'Thigh (cm)',
					'Hips (cm) ',
					'Chest (kg)',
					'Arm (cm)',
					'Shoulder (cm)',
					'BMI (cm) '
				]
			],

			body: array
		});

		doc.save('Progress report.pdf');
	};
	const calculateBmi = (height, weight) => {
		if (height !== '' && weight !== '') {
			let tempbmi = (weight / height / height) * 10000;
			tempbmi = tempbmi.toFixed(2);
			return tempbmi;
		}
	};

	const deleteProgress = async (progress) => {
		try {
			const response = await axios.delete(
				`${process.env.REACT_APP_BASE_URL}/api/progress/delete`,
				{
					headers: {
						'x-auth-token': `${auth.token}`,
						'Content-Type': 'application/json'
					},
					data: {
						progressId: progress._id
					}
				}
			);

			if (response.status === 200) {
				notification.showNotification(response.data.msg, false);
				window.location.reload();
			}
		} catch (error) {
			notification.showNotification(
				error.response.data.msg
					? error.response.data.msg
					: 'something went wrong. please try again',
				true
			);
		}
	};
	return (
		<div className='row'>
			<div className='col-md-12'>
				<table className='table table-striped table-dark' id='my-table'>
					<thead>
						<tr>
							<th scope='col'>Date</th>
							<th scope='col'>Height (cm) </th>
							<th scope='col'>Weight (kg)</th>
							<th scope='col'>Bicep (cm)</th>
							<th scope='col'>Thigh (cm)</th>
							<th scope='col'>Hips (cm) </th>
							<th scope='col'>Chest (kg)</th>
							<th scope='col'>Arm (cm)</th>
							<th scope='col'>Shoulder (cm)</th>
							<th scope='col'>BMI (cm) </th>
							<th scope='col'>Update</th>
							<th scope='col'>Delete</th>
						</tr>
					</thead>
					<tbody>
						{progress.map((p, idx) => {
							return (
								<tr key={idx}>
									<td>{p.date.substring(0, 10)}</td>
									<td>{p.height}</td>
									<td>{p.weight}</td>
									<td>{p.bicep}</td>
									<td>{p.thigh}</td>
									<td>{p.hips} </td>
									<td>{p.chest}</td>
									<td>{p.arm}</td>
									<td>{p.shoulder}</td>
									<td>{calculateBmi(p.height, p.weight)} </td>

									<td className=''>
										<Link
											to={{
												pathname:
													'/update-customer-progress',
												state: {
													user: user,
													progress: p
												}
											}}>
											<i
												className='fas fa-pencil pe-3'
												style={{
													fontSize: '22px',
													color: 'green'
												}}></i>
										</Link>
									</td>
									<td className=''>
										<i
											onClick={() => {
												if (
													window.confirm(
														'Are you sure you need to delete this progress?'
													)
												)
													deleteProgress(p);
											}}
											className='fas fa-trash-alt pe-3'
											style={{
												color: 'red',
												fontSize: '22px'
											}}></i>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className='row justify-content-end'>
				<button className='btn btn-primary w-25' onClick={genPdf}>
					Generate report
				</button>
			</div>
		</div>
	);
};

export default ProgressTable;
