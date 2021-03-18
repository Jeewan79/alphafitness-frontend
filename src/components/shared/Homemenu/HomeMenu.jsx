import React from 'react';
import MenuItem from './MenuItem';
import './HomePage.styles.css';

const HomeMenu = ({ options }) => {
	return (
		<div className='container'>
			<div className='row justify-content-around'>
				{options.map((element, idx) => {
					return (
						<MenuItem link={element.link} title={element.title} />
					);
				})}
			</div>
		</div>
	);
};

export default HomeMenu;
