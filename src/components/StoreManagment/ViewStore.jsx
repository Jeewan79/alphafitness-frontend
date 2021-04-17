import React from 'react';
import CustomerProductView from './Products/CustomerProductView';

const ViewStore = ({ products }) => {
	return (
		<div className='row justify-content-between justify-content-md-start'>
			{products.map((product, index) => {
				return <CustomerProductView product={product} key={index} />;
			})}
		</div>
	);
};

export default ViewStore;
