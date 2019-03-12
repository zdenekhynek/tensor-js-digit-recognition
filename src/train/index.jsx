import React from 'react';

import { getTrainingData, getTestData, NUM_CLASSES } from '../get_data';
import { trainModel } from '../tf_utils';

import classes from './train.css';

class Train extends React.Component {
	constructor(props) {
		super(props);

		this.state = { progress: [] };

		this.onProgress = this.onProgress.bind(this);
	}

	onProgress(msg) {
		const { progress } = this.state;
		progress.push(msg);
		
		this.setState({ progress });
	}

	componentDidMount() {
		const { progress } = this.state;
		const { onAgentUpdate } = this.props;

		onAgentUpdate('training model');

		trainModel(getTrainingData, getTestData, NUM_CLASSES, this.onProgress);
	}

	renderProgress(msg) {
		return (
			<li className={classes.item}>{msg}</li>
		)
	}

	render() {
		const { progress } = this.state;

		return (
			<ul>
				{progress.map(this.renderProgress)}
			</ul>
		)
	}
}

export default Train;