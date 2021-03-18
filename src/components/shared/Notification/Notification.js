import React, { useContext } from 'react';
import { NotificationContext } from '../../../context/NotificationContext';

const Notification = () => {
	const notification = useContext(NotificationContext);
	return (
		<div className='notifcation-wrapper'>
			<div className='notification-container'>
				<div className='row'>
					{notification.notify && (
						<div
							class={`alert fade show ${
								notification.error
									? 'alert-danger'
									: 'alert-success'
							}`}
							role='alert'>
							<span
								onClick={notification.clearNotification}
								className='notification-close'>
								&times;
							</span>
							<h4 class='alert-heading'>
								{notification.error
									? 'Something went wrong'
									: 'Success'}
							</h4>
							<p>{notification.message}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Notification;
