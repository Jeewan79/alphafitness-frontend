import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import './Advertisment.styles.css';
const CreateAdvertisment = () => {
	const notification = useContext(NotificationContext);
	const inputRef = useRef();
	const [file, setFile] = useState();
	const [signrequest, setSignrequest] = useState();
	const [image, setImageUrl] = useState();
	const auth = useContext(AuthContext);
	const [advertisment, setAdvertisment] = useState({
		title: '',
		description: ''
	});

	const { title, description } = advertisment;
	const [adImage, setAdImage] = useState(
		'https://wolper.com.au/wp-content/uploads/2017/10/image-placeholder.jpg'
	);

	const handleRefClick = () => {
		inputRef.current.click();
	};
	const handleChange = (e) => {
		setAdvertisment({
			...advertisment,
			[e.target.name]: e.target.value
		});
	};

	const onImageChange = async (e) => {
		let file = e.target.files[0];
		if (file.type === 'image/jpeg' || file.type === 'image/png') {
			let ur = URL.createObjectURL(e.target.files[0]);
			setAdImage(ur);
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
				setImageUrl(reulr);
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
		if (file) {
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
		} else {
			notification.showNotification('No file selected', true);
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			if (file != null) {
				uploadFile(file, signrequest);

				const body = {
					...advertisment,
					image
				};
				const config = {
					headers: {
						'x-auth-token': `${auth.token}`,
						'Content-Type': 'application/json'
					}
				};

				const res = await axios.post(
					`${process.env.REACT_APP_BASE_URL}/api/advertisment`,
					body,
					config
				);
				if (res.status === 200) {
					notification.showNotification(
						'Advertisment created successfully',
						false
					);
					setAdvertisment({
						title: '',
						description: ''
					});
					setFile(null);
					setImageUrl(null);
				}
				setTimeout(() => {
					window.history.back();
				}, [1000]);
			}
		} catch (error) {
			notification.showNotification(
				'cannot create the advertisment at the moment, Try again',
				true
			);
		}
	};
	return (
		<div className='row justify-content-between py-5'>
			<div className='row my-4'>
				<h1>Create advertisment</h1>
			</div>
			<div className='col-md-6 pb-5'>
				<div
					className='div ad-create-form-image w-100 position-relative'
					style={{
						backgroundImage: `url(${adImage.replace(
							/\s+/g,
							'%20'
						)})`
					}}>
					<input
						ref={inputRef}
						type='file'
						onChange={onImageChange}
						name='adImage'
						className='w-100 h-100 position-absolute image-upload-input '
					/>
				</div>
			</div>
			<div className='col-md-6 pb-5'>
				<h3>Advertisment Details</h3>
				<form onSubmit={handleSubmit}>
					<div className='row'>
						<div className='form-group'>
							<label htmlFor='title'>Title</label>
							<input
								type='text'
								className='form-control'
								name='title'
								value={title}
								onChange={handleChange}
								placeholder='Come join with us'
							/>
						</div>
					</div>
					<div className='row'>
						<div className='form-group'>
							<label htmlFor='title'>Title</label>
							<textarea
								rows={5}
								type='text'
								className='form-control'
								name='description'
								value={description}
								onChange={handleChange}
								placeholder='Come join with us'
							/>
						</div>
					</div>
					<div className='row my-2'>
						<div className='input-group col-12'>
							<button
								type='button'
								className='btn btn-primary w-50'
								onClick={handleRefClick}>
								select image
							</button>
							<div className='form-outline w-50 '>
								<input
									placeholder={image || 'No file chosen'}
									type='search'
									id='form1'
									className='form-control bg-light '
									disabled
								/>
							</div>
						</div>
					</div>
					<div className='row'>
						<div className='col-12'>
							<button
								type='submit'
								className='btn btn-success w-100'>
								Create advertisment
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateAdvertisment;
