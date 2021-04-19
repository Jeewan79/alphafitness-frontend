import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ViewAdvertisments = () => {
	const [isLoading, setIsloading] = useState(true);
	const [ads, setAds] = useState([]);
	const [searchData, setSearchData] = useState([]);

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
					setAds(res.data.advertisments);
					setSearchData(res.data.advertisments);
				}
			} catch (error) {}
			setIsloading(false);
		}
		fetchAds();
	}, []);
	return (
		<>
			<div className='row'>
				<h1>View Advertisments</h1>
			</div>
			{!isLoading ? (
				searchData.length > 0 ? (
					<>
						<div className='row my-2'>
							{' '}
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
								<button
									type='button'
									className='btn btn-primary'>
									<i className='fas fa-search'></i>
								</button>
							</div>
						</div>
						<div className='row justify-content-between'>
							{searchData.map((ad, index) => {
								return (
									<div className='col-md-6 my-2' key={index}>
										<div className='card w-100 '>
											<div className='row no-gutters'>
												<div className='col-sm-5 ad-card-img'>
													<div
														className='ad-card-img'
														style={{
															backgroundImage: `url(${ad.image.replace(
																/\s+/g,
																'%20'
															)})`
														}}
													/>
												</div>
												<div className='col-sm-7'>
													<div className='card-body'>
														<h5 className='card-title'>
															{ad.title}
														</h5>
														<p className='card-text'>
															{ad.description}
														</p>
														<Link
															to={{
																pathname: `/view-advertisment`,
																state: {
																	ad: ad
																}
															}}
															className='btn btn-primary'>
															View Advertisment
														</Link>
													</div>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</>
				) : (
					'No ads'
				)
			) : (
				'Loading'
			)}
		</>
	);
};

export default ViewAdvertisments;
