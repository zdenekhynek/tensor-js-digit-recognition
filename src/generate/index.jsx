import React from 'react';

import Axis from './axis';
import Heatmap from './heatmap';
import { randomIntFromInterval } from '../number_utils';

import classes from './generate.css';

export const MIN = 70;
export const MAX = 99;

export function generateRandomNumber() {
	const multiplier = 100;
	
	let randomNumber = randomIntFromInterval(MIN * multiplier, MAX * multiplier);
	randomNumber /= multiplier;
	
	return randomNumber.toFixed(2);
}

class Generate extends React.Component {
	constructor(props) {
		super(props);

		this.state = { number: generateRandomNumber() };
	}

	componentDidMount() {
	
  	const number = document.getElementById('maxNumber');
  	
  	function updateNumber() {
  		number.innerHTML = numberFormat();
  	};

  	const interval = setInterval(() => {
  		this.update();
  	}, 150);
	}

	update() {
		this.setState({ number: generateRandomNumber() });
	}

	render() {
		const { number } = this.state;

		//	<img className={classes.templateImage} src="./data/energy_frames/frame_0001.png" />
	  			

		return (
			<div>
				<div className={classes.frame}>
	  			<div className={classes.graphics}>
	  				<Heatmap seed={number} />
	  				<div className={classes.axis}>
	  					<Axis max={number} />
	  				</div>
	  			</div>
	  		</div>
	  	</div>
		);
	}
}

export default Generate;