import React from 'react';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection'; 
import { axisRight } from 'd3-axis';
import { format } from 'd3-format';

import classes from './axis.css';

export const DYNAMIC_RANGE = 10;
export const NUMBER_FORMAT = format('.4n');

export function getTickValues(scale, max, min) {
	const generatedTicks = scale.ticks();

	//	filter those that could overlap with min max
	const buffer = .2;
	const filteredTicks = generatedTicks.filter((value) => {
		return value > (min + buffer) && value < (max - buffer);
	});

	return filteredTicks.concat([min, max]);
}

class Axis extends React.Component {
	constructor(props) {
		super(props);

		this.svg = React.createRef();
		this.axisParent = React.createRef();
	}

	componentDidUpdate() {
		this.update();
	}

	componentDidMount() {
		this.update();
	}

	update() {
		const { max } = this.props;
		
		const svgNode = this.svg.current;
		const node = this.axisParent.current;
		const clientRect = svgNode.getBoundingClientRect();
		const height = clientRect.height - (42 * 2);

		const domainRange = [max, max - DYNAMIC_RANGE];
		const linearScale = scaleLinear().domain(domainRange).range([0, height]);
		
		const tickValues = getTickValues(linearScale, +domainRange[0], +domainRange[1]);
		const axis = axisRight(linearScale).tickValues(tickValues).tickFormat(NUMBER_FORMAT);

		select(node).call(axis);
	}

	render() {
		const { max } = this.props;

		const linearScale = scaleLinear().domain([0, 100]).range([0, 200]);

		return (
			<div className={classes.axis}>
				<svg ref={this.svg} className={classes.svg}>
					<defs>
						<linearGradient xmlns="http://www.w3.org/2000/svg" id="mainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
							<stop offset="0" stopColor="purple"/>
							<stop offset="0.15" stopColor="red"/>
							<stop offset="0.30" stopColor="#ff0"/>
							<stop offset="0.55" stopColor="#0f0"/>
							<stop offset="0.70" stopColor="cyan"/>
							<stop offset="0.85" stopColor="blue"/>
							<stop offset="1" stopColor="#f0f"/>
						</linearGradient>
					</defs>
					<g ref={this.axisParent} className={classes.axisParent} />
					<rect className={classes.gradient} />
				</svg>
	  	</div>
		);
	}
}

export default Axis;