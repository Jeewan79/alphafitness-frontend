import React from 'react';
import { Link } from 'react-router-dom';

const AdminProductView = ({ product, deleteProduct }) => {
	return (
		<div className='col-md-12 admin-product-view'>
			<div className='row mx-1'>
				<div
					className='col-md-2 admin-product-image'
					style={{
						backgroundImage: `url(${product.image.replace(
							/\s+/g,
							'%20'
						)})`
					}}></div>
				<div className='col-md-3 text-center'>
					ID : {product._id.substring(0, 10)}
					<p>By {product.brand.name}</p>
					{product.qty > 0 ? (
						<span className='available-text'>available now</span>
					) : (
						<span className='unavailable-text'>out of stock</span>
					)}
				</div>
				<div className='col-md-4 text-center text-md-start my-auto'>
					<h4>{product.name}</h4>
				</div>
				<div className='col-md-3  text-center text-lg-end my-auto'>
					<Link
						to={{
							pathname: '/update-product',
							state: {
								product: product
							}
						}}>
						<i
							className='fas fa-user-edit pe-3'
							style={{
								fontSize: '22px'
							}}></i>
					</Link>
					<i
						className='fas fa-trash-alt pe-3'
						style={{
							color: 'red',
							fontSize: '22px'
						}}
						onClick={() => {
							if (
								window.confirm(
									'Are you sure you need to delete this Product? All the orders related to this product will be deleted too'
								)
							)
								deleteProduct(product);
						}}></i>
				</div>
			</div>
		</div>
	);
};

export default AdminProductView;
