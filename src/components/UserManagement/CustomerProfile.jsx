import axios from 'axios';
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';

const CustomerProfile = (props) => {
	const notification = useContext(NotificationContext);
	const auth = useContext(AuthContext);
	const customer = props.location.state.customer;
	const role = props.location.state.role;
	const [profilePic, setProfilePic] = useState(customer.image);
	const [file, setFile] = useState();
	const [signrequest, setSignrequest] = useState();
	const [image, setImgurl] = useState();
	const [toggle, setToggle] = useState(false);

	const onImageChange = async (e) => {
		let file = e.target.files[0];
		if (file.type === 'image/jpeg' || file.type === 'image/png') {
			let ur = URL.createObjectURL(e.target.files[0]);
			setProfilePic(ur);
			setFile(file);
			let signed = await axios.get(
				`${process.env.REACT_APP_BASE_URL}/api/aws/signed?filename=${file.name}&filetype=${file.type}`
			);
			if (signed.status !== 200) {
				notification.showNotification(
					'Somthing went wrong please select the image again',
					true
				);
			} else {
				let re = signed.data.signedRequest;
				let reulr = signed.data.url;
				setSignrequest(re);
				setImgurl(reulr);
			}
		} else {
			notification.showNotification(
				'Please upload jpeg or png image',
				true
			);
		}
	};
	function uploadFile(file, signedRequest) {
		const xhr = new XMLHttpRequest();
		xhr.open('PUT', signedRequest);
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					return true;
				} else {
					notification.showNotification(
						'Somthing went wrong when uploading the image',
						true
					);
					return false;
				}
			}
		};
		xhr.send(file);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setToggle(false);
		try {
			await uploadFile(file, signrequest);
			const body = {
				image: image
			};

			const config = {
				headers: {
					'x-auth-token': `${auth.token}`,
					'Content-Type': 'application/json'
				}
			};
			const response = await axios.put(
				`${process.env.REACT_APP_BASE_URL}/api/auth/profilepic`,
				body,
				config
			);
			if (response.status === 200) {
				let cus = customer;
				cus.image = image;
				setTimeout(() => {
					auth.reloadUser(cus);
					window.location.replace('/');
				}, 4000);
				notification.showNotification('profile picture updated', false);
			} else {
				notification.showNotification('something went wrong', true);
			}
		} catch (err) {
			notification.showNotification('Server error', true);
		}
	};

	return (
		<div className='container pb-5'>
			<div className='row justify-content-center pb-5'>
				<div className='col-lg-6  col-md-6 col-sm-12 col-xs-12 background-border'>
					<div className='row m-2 text-center'>
						<h3>{role === 'admin' ? 'Customer' : 'My'} profile</h3>
					</div>
					<hr />
					<div className='row  text-center mb-5 justify-content-center'>
						{toggle ? (
							<img
								src={profilePic}
								alt=''
								width='100'
								className='img-fluid  rounded-circle mb-3 img-thumbnail shadow-sm'
							/>
						) : (
							<img
								src={customer.image.replace(/\s+/g, '%20')}
								alt=''
								className='avatar-image mb-2 '
							/>
						)}

						{role === 'user' ? (
							toggle ? (
								<React.Fragment>
									<form method='post' onSubmit={handleSubmit}>
										<div
											className='form-group'
											controlId='formGridAddress1'>
											<input
												type='file'
												id='custom-file'
												label='Add image'
												name='image'
												accept='image/jpeg, image/png'
												onChange={(e) =>
													onImageChange(e)
												}
												custom
											/>
										</div>
										<button className='btn btn-primary'>
											Update
										</button>
									</form>
									<button
										className='btn btn-danger'
										onClick={() => setToggle(false)}>
										cancel
									</button>
								</React.Fragment>
							) : (
								<button
									className='btn btn-primary'
									onClick={() => setToggle(true)}>
									Change profile picture
								</button>
							)
						) : (
							''
						)}

						<div className='row'>
							<div className='col-6 col-xs-6 col-md-6 text-start'>
								Email
							</div>
							<div className='col-6 col-xs-6 col-md-6 text-start'>
								{customer.email}
							</div>
							<div className='col-6 col-xs-6 col-md-6 text-start'>
								Full Name:
							</div>
							<div className='col-6 col-xs-6 col-md-6 text-start'>
								{customer.firstName} {customer.lastName}
							</div>
							<div className='col-6 col-xs-6 col-md-6 text-start'>
								Address
							</div>
							<div className='col-6 col-xs-6 col-md-6 text-start'>
								{customer.address}
							</div>
							<div className='col-6 col-xs-6 col-md-6 text-start'>
								Age
							</div>
							<div className='col-6 col-xs-6 col-md-6 text-start'>
								{customer.age}
							</div>
							<div className='col-6 col-xs-6 col-md-6 text-start'>
								Gender
							</div>
							<div className='col-6 col-xs-6 col-md-6 text-start'>
								{customer.gender}
							</div>
							<div className='col-6 col-xs-6 col-md-6 text-start'>
								Mobile
							</div>
							<div className='col-6 col-xs-6 col-md-6 text-start'>
								{customer.mobile}
							</div>
							<div className='col-6 col-xs-6 col-md-6 text-start'>
								Package
							</div>
							<div className='col-6 col-xs-6 col-md-6 text-start'>
								{customer.package
									? customer.package.name
									: 'Weekday'}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CustomerProfile;
