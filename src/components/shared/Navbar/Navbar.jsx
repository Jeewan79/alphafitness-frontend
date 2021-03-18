import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { Redirect } from 'react-router-dom';

const Navbar = ({}) => {
	const auth = useContext(AuthContext);

	const signOut = () => {
		auth.logout();
		<Redirect to={'/login'} />;
	};
	return (
		<div>
			<nav className='navbar navbar-expand-lg navbar-light bg-light'>
				<div className='container-fluid'>
					<Link className='navbar-brand' id='navbar-brand' to='/'>
						ALPHA FITNESS
					</Link>
					<button
						className='navbar-toggler'
						type='button'
						data-bs-toggle='collapse'
						data-bs-target='#navbarSupportedContent'
						aria-controls='navbarSupportedContent'
						aria-expanded='false'
						aria-label='Toggle navigation'>
						<span className='navbar-toggler-icon'></span>
					</button>
					<div
						className='collapse navbar-collapse'
						id='navbarSupportedContent'>
						<ul className='navbar-nav me-auto mb-2 mb-lg-0'>
							{!auth.isLoggedIn && (
								<React.Fragment>
									<li className='nav-item'>
										<Link
											className='nav-link '
											to='/login'
											tabIndex='-1'>
											Login
										</Link>
									</li>
									<li className='nav-item'>
										<Link
											className='nav-link '
											to='/register'>
											Register
										</Link>
									</li>
								</React.Fragment>
							)}
							{auth.isLoggedIn && (
								<React.Fragment>
									<li className='nav-item'>
										<Link
											className='nav-link '
											to='/'
											tabIndex='-1'>
											Home
										</Link>
									</li>
									<li className='nav-item'>
										<Link className='nav-link ' to='/store'>
											Store
										</Link>
									</li>
								</React.Fragment>
							)}
							<li className='nav-item'>
								<Link className='nav-link ' to='/contact'>
									Contact us
								</Link>
							</li>
							<li className='nav-item'>
								<Link className='nav-link ' to='/about'>
									About us
								</Link>
							</li>
							<li className='nav-item dropdown'>
								<a
									className='nav-link dropdown-toggle'
									href='#'
									id='navbarDropdown'
									role='button'
									data-bs-toggle='dropdown'
									aria-expanded='false'>
									Dropdown
								</a>
								<ul
									className='dropdown-menu'
									aria-labelledby='navbarDropdown'>
									<li>
										<a className='dropdown-item' href='#'>
											Action
										</a>
									</li>
									<li>
										<a className='dropdown-item' href='#'>
											Another action
										</a>
									</li>
									<li>
										<hr className='dropdown-divider' />
									</li>
									<li>
										<a className='dropdown-item' href='#'>
											Something else here
										</a>
									</li>
								</ul>
							</li>
						</ul>
						<form className='d-flex'>
							<input
								className='form-control me-2'
								type='search'
								placeholder='Search'
								aria-label='Search'
							/>
							<button
								className='btn btn-outline-success'
								type='submit'>
								Search
							</button>
						</form>

						{auth.isLoggedIn && (
							<ul className='navbar-nav m-auto mb-2 mb-lg-0 dropleft'>
								<li className='nav-item dropdown '>
									<a
										className='nav-link dropdown-toggle'
										href='#'
										id='navbarDropdown'
										role='button'
										data-bs-toggle='dropdown'
										aria-expanded='false'>
										<img
											src={auth.user.image}
											alt=''
											className='avatar-image-small mr-2'
										/>
										{auth.fullName}
									</a>
									<ul
										className='dropdown-menu'
										aria-labelledby='navbarDropdown'>
										<li>
											<a
												className='dropdown-item'
												href='#'>
												Action
											</a>
										</li>
										<li>
											<a
												className='dropdown-item'
												href='#'>
												Another action
											</a>
										</li>
										<li>
											<hr className='dropdown-divider' />
										</li>
										<button
											className='btn btn-outline-danger m-2'
											onClick={signOut}>
											Logout
										</button>
									</ul>
								</li>
							</ul>
							// <ul className='navbar-nav ms-auto mb-2 mb-lg-0'>
							// 	<li className='nav-item'>
							// 		<span className='text-dark nav-link'>
							// 			{auth.fullName}
							// 		</span>
							// 	</li>
							// 	<button
							// 		className='btn btn-outline-danger m-2'
							// 		onClick={signOut}>
							// 		Logout
							// 	</button>
							// </ul>
						)}
					</div>
				</div>
			</nav>
		</div>
	);
};

export default Navbar;
