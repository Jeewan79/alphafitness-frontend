import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import ViewComment from './ViewComment';

const ViewAdvertisment = (props) => {
	const auth = useContext(AuthContext);
	const ad = props.location.state.ad;
	const [comments, setComments] = useState(ad.comments);
	const notification = useContext(NotificationContext);
	const [isLoading, setIsLoading] = useState(false);
	const [comment, setComment] = useState({
		commentText: ''
	});
	const { commentText } = comment;
	const onChange = (e) => {
		setComment({
			...comment,
			[e.target.name]: e.target.value
		});
	};

	const fetchComments = async () => {
		try {
			const res = await axios.get(
				`${process.env.REACT_APP_BASE_URL}/api/advertisment/ad/${ad._id}`
			);
			if (res.status === 200) {
				setComments(res.data.advertisment.comments);
			}
		} catch (error) {
			notification.showNotification(
				'cannot load comments, reload to see new comments',
				true
			);
		}
	};
	const onSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const body = {
				advertismentId: ad._id,
				...comment
			};
			const config = {
				headers: {
					'x-auth-token': `${auth.token}`,
					'Content-Type': 'application/json'
				}
			};
			const res = await axios.put(
				`${process.env.REACT_APP_BASE_URL}/api/advertisment/comment`,
				body,
				config
			);
			if (res.status === 200) {
				fetchComments();
				notification.showNotification(
					'comment posted successfully',
					false
				);
			}
		} catch (err) {
			notification.showNotification(
				'cannot post the comment at the moment, try again',
				true
			);
		}
		setComment({
			commentText: ''
		});
		setIsLoading(false);
	};
	return (
		<div className='pb-5'>
			<div className='row pb-5'>
				<h1>View Adverisment</h1>
			</div>

			<div className='row justify-content-center pb-5'>
				<div className='col-md-8'>
					<div className='card'>
						<div className='card-body'>
							<img
								src={ad.image.replace(/\s+/g, '%20')}
								className='card-img-top'
								alt='adverisment'
							/>
							<h3 className='card-title my-2'>{ad.title}</h3>
							<p className='card-text'>
								This is a wider card with supporting text below
								as a natural lead-in to additional content. This
								content is a little bit longer.
							</p>
							<p className='card-text'>
								<small className='text-muted'>
									By {ad.user.firstName} {ad.user.lastName}
								</small>
							</p>
						</div>

						<div className='row'>
							{auth.role === 'admin' ? (
								<>
									<div className='col-5 m-2'>
										<Link
											to={{
												pathname:
													'/update-advertisment',
												state: {
													ad: ad
												}
											}}
											className='btn btn-primary w-100'>
											Update advertisment
										</Link>
									</div>
									<div className='col-5 m-2'>
										<Link
											to='/manage-advertisment'
											className='btn btn-primary w-100'>
											manage advertisment
										</Link>
									</div>
								</>
							) : (
								auth.user._id === ad.user._id && (
									<>
										<div className='col-5 m-2'>
											<Link
												to={{
													pathname:
														'/update-advertisment',
													state: {
														ad: ad
													}
												}}
												className='btn btn-primary w-100'>
												Update advertisment
											</Link>
										</div>
										<div className='col-5 m-2'>
											<Link
												to='/manage-advertisment'
												className='btn btn-primary w-100'>
												manage advertisment
											</Link>
										</div>
									</>
								)
							)}
						</div>
					</div>
				</div>
			</div>
			<div className='row justify-content-center pb-5'>
				<div className='col-md-8 p-4 border'>
					<h4>Add comment</h4>
					<form onSubmit={onSubmit}>
						<div className='form-group'>
							<textarea
								rows={5}
								className='form-control'
								name='commentText'
								value={commentText}
								onChange={onChange}
								placeholder='Is this the last price'
							/>
						</div>
						<div className='row my-2 justify-content-end'>
							<div className='col-6'>
								<button
									type='submit'
									className='btn btn-primary w-100'>
									{isLoading ? (
										<>
											posting comment{' '}
											<i className='fas fa-spinner'></i>
										</>
									) : (
										'Add Comment '
									)}
								</button>
							</div>
						</div>
					</form>
					<h4 className='mt-4'>Comments</h4>
					<div className='row justify-content-between'>
						{comments.map((comment, index) => {
							return (
								<ViewComment comment={comment} key={index} />
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewAdvertisment;
