import React from 'react';
import AboutUsImage from '../../assets/images/about.svg';
const Aboutus = () => {
	return (
		<React.Fragment>
			<div>
				<div className='container py-2'>
					<div className='row h-80 align-items-center py-2'>
						<div className='col-lg-6'>
							<h1 className='display-4'>About us </h1>
							<p className='lead text-muted mb-0'>
								The best place to do your workouts
							</p>
							<p className='lead text-muted'>
								Start today with &nbsp;
								<b>Alpha fitness</b>
							</p>
						</div>
						<div className='col-lg-6 d-lg-block'>
							<img
								src={AboutUsImage}
								alt=''
								className='img-fluid'
							/>
						</div>
					</div>
				</div>
			</div>
			<div className='py-5'>
				<div className='container py-2'>
					<div className='row mb-4'>
						<div className='col-lg-7'>
							<h2 className='display-4'>About Alpha fitness</h2>
							<p className='font-italic'>
								Here are some interesting things about Alpha
								fitness
							</p>
						</div>
					</div>

					<div className='row text-center'>
						<div className='col-xl-3 col-sm-6 mb-5'>
							<div className='bg-white rounded shadow-sm py-5 px-4'>
								<img
									src='https://res.cloudinary.com/mhmd/image/upload/v1556834132/avatar-4_ozhrib.png'
									alt=''
									width='100'
									className='img-fluid rounded-circle mb-3 img-thumbnail shadow-sm'
								/>
								<h5 className='mb-0'>Owner name</h5>
								<span className='small text-uppercase text-muted'>
									Owner - Founder
								</span>
							</div>
						</div>

						<div className='col-xl-3 col-sm-6 mb-5'>
							<div className='bg-white rounded shadow-sm py-5 px-4'>
								<img
									src='https://img.icons8.com/dusk/128/000000/date-to.png'
									alt=''
									width='100'
									className='img-fluid  rounded-circle mb-3 img-thumbnail shadow-sm'
								/>
								<h5 className='mb-0'>Start date</h5>
								<span className='small text-uppercase text-muted'>
									August 24, 2014
								</span>
							</div>
						</div>

						<div className='col-xl-3 col-sm-6 mb-5'>
							<div className='bg-white rounded shadow-sm py-5 px-4'>
								<img
									src='https://img.icons8.com/emoji/96/000000/sports-medal-emoji.png'
									alt=''
									width='100'
									className='img-fluid rounded-circle mb-3 img-thumbnail shadow-sm'
								/>
								<h5 className='mb-0'>2020</h5>
								<span className='small text-uppercase text-muted'>
									Island champion
								</span>
							</div>
						</div>

						<div className='col-xl-3 col-sm-6 mb-5'>
							<div className='bg-white rounded shadow-sm py-5 px-4'>
								<img
									src='https://img.icons8.com/bubbles/100/000000/conference-call.png'
									alt=''
									width='100'
									className='img-fluid rounded-circle mb-3 img-thumbnail shadow-sm'
								/>
								<h5 className='mb-0'>Proud members</h5>
								<span className='small text-uppercase text-muted'>
									3000+ members
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Aboutus;
