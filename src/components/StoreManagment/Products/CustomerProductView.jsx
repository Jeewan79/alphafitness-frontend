import React from 'react';
import { Link } from 'react-router-dom';

const CustomerProductView = ({ product }) => {
	return (
		<Link
			to={`/view-product/${product._id}`}
			className='col-lg-3 col-md-5 text-decoration-none text-dark my-2 mx-2'>
			<div className='card' style={{ width: '100%' }}>
				<div
					className='customer-product '
					style={{
						backgroundImage: `url(${product.image.replace(
							/\s+/g,
							'%20'
						)})`
					}}></div>
				<div className='card-body'>
					<h5 className='card-title'>{product.name}</h5>
					<div className='row'>
						<div className='col-6'>
							<h6 className='card-title'>
								LKR {parseFloat(product.price).toFixed(2)}
							</h6>
						</div>

						<div className='col-6 text-end'>
							<h6 className='card-title'>
								By {product.brand.name}
							</h6>
						</div>
					</div>
					<p className='card-text'>
						{product.smallDescription.substring(0, 100)}
					</p>

					{product.qty > 0 ? (
						<span className='available-text'>available now</span>
					) : (
						<span className='unavailable-text'>out of stock</span>
					)}
				</div>
			</div>
		</Link>
	);
};

export default CustomerProductView;
