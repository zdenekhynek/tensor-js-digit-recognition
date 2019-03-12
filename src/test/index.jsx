import React from 'react';

import { loadPretrainedModel } from '../tf_utils';
import { getFramePaths } from '../frame_utils';
import { predictFrames } from '../predictions';
import PredictionThumb from './prediction_thumb';

import classes from './test.css';

export const ENERGY_FRAMES_PATH = './data/frames/image-';

class Test extends React.Component {
	constructor(props) {
		super(props);

		this.state = { predictions: [] };
	}

	componentDidMount() {
		const { onAgentUpdate } = this.props;

		onAgentUpdate('loading pre-trained model');

		loadPretrainedModel()
			.then(({ pretrainedModel, model }) => {
				onAgentUpdate('classifying images');

				const frames = getFramePaths(ENERGY_FRAMES_PATH, 30);
				const predictionPromise = Promise.all(predictFrames(frames, pretrainedModel, model));

				predictionPromise.then((predictions) => {
					this.setState({ predictions });
					onAgentUpdate('done');
				});
			});
	}

	renderPredictionThumb(prediction) {
		return (
			<li key={prediction.imagePath}>
				<PredictionThumb {...prediction}/>
			</li>
		);
	}

	render() {
		const { predictions } = this.state;
		
		return (
			<div>
				<ul className={classes.list}>
					{predictions.map(this.renderPredictionThumb)}
				</ul>
			</div>
		)
	}
}

export default Test;