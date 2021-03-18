import React, { useContext } from 'react';
import HomeMenu from '../../components/shared/Homemenu/HomeMenu';
import { AuthContext } from '../../context/AuthContext';

const Homepage = ({}) => {
	const auth = useContext(AuthContext);
	const adminMenu = [
		{ title: 'Add Package', link: '/add-package' },
		{ title: 'Add Customer', link: '/add-customer' },
		{ title: 'Add Instructor', link: '/add-instructor' }
	];
	return (
		<div>
			{auth.role == 'admin' ? <HomeMenu options={adminMenu} /> : 'user'}
		</div>
	);
};

export default Homepage;
