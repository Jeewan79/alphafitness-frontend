import React from 'react';

const BMICalulator = ({ calculateBmi, handleChange, weight, height, bmi }) => {
	const getBmiText = (bm) => {
		let bmi = parseFloat(bm);

		if (bmi <= 18.5) {
			return 'Under Weight';
		} else if (bmi <= 24.9) {
			return 'Normal Weight';
		} else if (bmi <= 29.9) {
			return 'Over Wieght';
		} else if (bmi >= 30) {
			return 'Obesity';
		}
	};
	return (
		<div className='col-md-6'>
			<div className='row'>
				<div className='col-md-6 text-center'>
					<div className='mb-3 text-start'>
						<label htmlFor='weight'>Weight (in Kg)</label>
						<input
							type='number'
							name='weight'
							className='form-control'
							value={weight}
							onChange={handleChange}
							required
							placeholder='70'
							min={10}
						/>
					</div>

					<div className='mb-3 text-start'>
						<label htmlFor='height'>Height (in Cm)</label>
						<input
							type='number'
							name='height'
							className='form-control'
							value={height}
							onChange={handleChange}
							required
							placeholder='160'
							min={40}
						/>
					</div>
					<div className='mb-3 text-start'>
						<button
							className='btn btn-primary'
							onClick={calculateBmi}>
							Calculate BMI
						</button>
					</div>
				</div>
				<div className='col-md-6 text-center p-5'>
					<span className='align-center'>{bmi}</span>
					<h5>{getBmiText(bmi)}</h5>
				</div>
			</div>
		</div>
	);
};

export default BMICalulator;
