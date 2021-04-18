import React, { useContext } from 'react';
import HomeMenu from '../../components/shared/Homemenu/HomeMenu';
import { AuthContext } from '../../context/AuthContext';

const PackageManagment = () => {
	const auth = useContext(AuthContext);
	const adminMenu = [
		{ title: 'Add new Package', link: '/add-package' },

		{ title: 'View / Update Packages', link: '/view-packages' },
		{ title: 'Manage package types', link: '/manage-package-types' },
		{
			title: 'Assign Package to customer',
			link: '/assign-package-to-customer'
		}
	];

	// const instructorMenu = [
	// 	{ title: 'Manage Advertisment', link: '/manage-advertisment' },
	// 	{ title: 'Manage Workouts', link: '/manage-workouts' },
	// 	{ title: 'My profile', link: '/instructor-profile' },
	// 	{ title: 'Customer Progress', link: '/customer-progress' }
	// ];

	const userMenu = [
		{ title: 'View Packages', link: '/view-packages' },
		{ title: 'My Packages', link: '/my-packages' }
	];
	return (
		<div className='pb-5'>
			<div className='row welcome-board m-5 text-center'>
				<h1>Welcome to alpha fitness</h1>
			</div>
			{auth.role === 'admin' ? (
				<HomeMenu options={adminMenu} />
			) : auth.role === 'instructor' ? (
				<h1>You don't have access to this page</h1>
			) : (
				<HomeMenu options={userMenu} />
			)}
		</div>
	);
};

export default PackageManagment;
