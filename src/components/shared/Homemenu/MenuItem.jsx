import React from 'react';
import { Link } from 'react-router-dom';

const MenuItem = ({ link, title }) => {
	return (
		<div className='col-md-3 p5 menu-item'>
			<Link to={link} className='menu-link'>
				{title}
			</Link>
		</div>
	);
};

export default MenuItem;
