import React from 'react';
import simpleheat from 'simpleheat';
import { interpolateArray } from 'd3-interpolate';

import { randomIntFromInterval } from '../number_utils';

import classes from './heatmap.css';

export const GRADIENT = { 0: 'purple', 0.15: 'red', 0.3: '#ff0', 0.55: '#0f0', 0.7: 'cyan', 0.85: 'blue', 1: '#f0f' };

export function generateRandomData(num) {
	return new Array(num).fill(0).map((i) => {
		return [randomIntFromInterval(0, 902), randomIntFromInterval(0, 726), randomIntFromInterval(0, 5)];
	});
}

//	update very second
export const UPDATE_INTERVAL = 6;

class Heatmap extends React.Component {
	constructor(props) {
		super(props);
		this.canvasRef = React.createRef();

		this.updateIndex = 0;
	}

	componentDidMount() {
		this.heat = simpleheat(this.canvasRef.current);
		this.heat.gradient(GRADIENT);
		this.heat.radius(40, 60);

		this.update();
	}

	componentDidUpdate() {
		this.update();
	}

	update() {
		const updateModulo = this.updateIndex % UPDATE_INTERVAL;
		const updateTick = updateModulo / UPDATE_INTERVAL;
			
		if (updateModulo === 0) {
			this.heat.data(generateRandomData(100));
		}

		this.heat.draw(1);

		this.updateIndex++;
	}

	render() {
		return (
			<canvas ref={this.canvasRef} width="902" height="726" className={classes.heatmap} />
		);		
	}
}

export default Heatmap;