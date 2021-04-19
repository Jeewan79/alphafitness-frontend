import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdverismentTable from '../../components/AdvertismentManagment/AdverismentTable';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdvertismentManagment = () => {
	const [isLoading, setIsloading] = useState(true);
	const [ads, setAds] = useState([]);
	const [searchData, setSearchData] = useState([]);
	const auth = useContext(AuthContext);
	const notification = useContext(NotificationContext);

	const doc = new jsPDF();

	const generateReport = () => {
		doc.text(`Advertisments of Alpha fitness gym`, 30, 10);

		let array = [];
		ads.map((ad, index) => {
			let row = [];
			row.push(index + 1);
			row.push(ad.title);
			row.push(ad.description);
			row.push(ad.user.firstName);
			row.push(ad.user.email);
			row.push(ad.comments.length);

			array.push(row);
			return row;
		});

		doc.autoTable({
			head: [
				['#', 'Title', 'Description', 'Posted By', 'Email', 'Comments']
			],

			body: array
		});

		doc.save('adverisments.pdf');
	};

	const search = (e) => {
		if (!e.target.value) {
			setSearchData(ads);
		} else {
			let list = ads.filter(
				(ad) =>
					ad.title.toLowerCase().includes(e.target.value) ||
					ad.user.firstName.toLowerCase().includes(e.target.value)
			);
			setSearchData(list);
		}
	};
	useEffect(() => {
		async function fetchAds() {
			try {
				const res = await axios.get(
					`${process.env.REACT_APP_BASE_URL}/api/advertisment`
				);

				if (res.status === 200) {
					if (auth.role === 'admin') {
						setAds(res.data.advertisments);
						setSearchData(res.data.advertisments);
					} else {
						let myads = res.data.advertisments.filter(
							(ad) => ad.user._id === auth.userId
						);
						setAds(myads);
						setSearchData(myads);
					}
				}
			} catch (error) {
				if (error.response.staus === 500)
					notification.showNotification('server error', true);
			}
			setIsloading(false);
		}
		fetchAds();
	}, [notification, auth.role, auth.userId]);
	return (
		<div className='container pb-5'>
			<div className='row justify-content-between my-3'>
				<h1>Manage Adverisments</h1>
				<div className='col-md-5 my-2'>
					<div className='input-group'>
						<div className='form-outline'>
							<input
								placeholder='search advertisment'
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
						to='/add-advertisment'>
						Add Advertisment
					</Link>
				</div>
			</div>
			{!isLoading ? (
				searchData.length > 0 ? (
					<>
						<AdverismentTable advertisments={searchData} />
						<div className='row justify-content-end text-end'>
							<div className='col-md-4 mt-4'>
								<button
									className='btn btn-primary'
									onClick={generateReport}>
									Generate report
								</button>
							</div>
						</div>
					</>
				) : (
					'no adverisments found '
				)
			) : (
				'Loading'
			)}
		</div>
	);
};

export default AdvertismentManagment;
