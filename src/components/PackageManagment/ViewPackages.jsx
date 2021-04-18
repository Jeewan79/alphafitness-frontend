import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import PackageTable from './PackageTable';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ViewPackages = () => {
	const auth = useContext(AuthContext);
	const [isLoading, setIsloading] = useState(true);
	const [packages, setPackages] = useState([]);
	const [searchData, setSearchData] = useState([]);
	const notification = useContext(NotificationContext);

	const doc = new jsPDF();
	const genPackagesPdf = () => {
		doc.text('Packages of Alpha fitness gym', 10, 10);
		doc.autoTable({ html: '#my-table' });

		let array = [];
		packages.map((pack, idx) => {
			let item = [];
			item.push(idx + 1);
			item.push(pack.category.name);
			item.push(pack.name);
			item.push(pack.description);
			item.push(pack.price);

			array.push(item);
			return item;
		});
		doc.autoTable({
			head: [['#', 'Type', 'Package', 'Description', 'Price']],

			body: array
		});

		doc.save('Packages.pdf');
	};

	const search = (e) => {
		if (!e.target.value) {
			setSearchData(packages);
		} else {
			let list = packages.filter((pack) =>
				pack.name.toLowerCase().includes(e.target.value)
			);
			setSearchData(list);
		}
	};

	useEffect(() => {
		async function getData() {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_BASE_URL}/api/package`
				);

				if (response.status === 200) {
					setPackages(response.data.packages);
					setSearchData(response.data.packages);
				} else {
					notification.showNotification('No packages yet', true);
				}
			} catch (error) {
				notification.showNotification(error.response.data.msg, true);
			}
			setIsloading(false);
		}

		getData();
	}, [notification]);

	return (
		<div className='container pb-5 '>
			<div className='row justify-content-between my-3'>
				<h1>{auth.role === 'admin' ? 'Manage' : 'View'} Packages</h1>{' '}
				<div className='col-md-5 my-2'>
					{!isLoading ? (
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
					) : (
						<div className='input-group'>
							<div className='form-outline'>
								<input
									placeholder='Loading...'
									disabled
									className='form-control'
								/>
							</div>
							<button type='button' className='btn btn-primary'>
								<i className='fas fa-spinner'></i>
							</button>
						</div>
					)}
				</div>
				{auth.role === 'admin' && (
					<React.Fragment>
						<div className='col-md-3 my-2'>
							<Link
								className='btn btn-primary w-100'
								to='/add-package'>
								Add Package
							</Link>
						</div>
					</React.Fragment>
				)}
			</div>
			{!isLoading ? (
				searchData.length > 0 ? (
					<>
						<PackageTable
							packages={searchData}
							auth={auth}
							notification={notification}
						/>
						<div className='row justify-content-end mt-5 pb-5'>
							<button
								className='btn btn-primary w-25 '
								onClick={genPackagesPdf}>
								{auth.role === 'admin'
									? 'Genarate PDF'
									: 'Download PDF'}
							</button>
						</div>
					</>
				) : (
					'No Packages found '
				)
			) : (
				'Loading'
			)}
		</div>
	);
};

export default ViewPackages;
