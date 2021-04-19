import React from 'react';

const ViewComment = ({ comment }) => {
	return (
		<div className='col-md-5 my-3'>
			<div className='row'>
				<div className='col-md-4'>
					<img
						src={comment.user.image.replace(/\s+/g, '%20')}
						alt='user'
						style={{ width: '100%', maxWidth: '150px' }}
					/>
				</div>
				<div className='col-md-8'>
					<h5>{comment.user.firstName}</h5>
					<p className='text-wrap'>{comment.comment}</p>
				</div>
			</div>
		</div>
	);
};

export default ViewComment;
