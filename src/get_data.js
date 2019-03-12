import { addLabels } from './tf_utils';

/*
	Paths to the directorties with training and testing
	data in the 'dist' of folder
*/
export const DATA_DIR = './data';
export const TRAINING_DIRS = ['training/1', 'training/2', 'training/3', 'training/4', 'training/5',
	'training/6', 'training/7', 'training/8'];
export const TESTING_DIRS = ['testing/9'];

/*
	Names of the images inside of the folder
*/
export const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/*
	Labels for digits inside folders
*/
export const LABELS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 
	'eight', 'nine'];
export const NUM_CLASSES = LABELS.length;

/*
	Params of the images used
*/
export const IMAGE_W = 8;
export const IMAGE_H = 10;
export const IMAGE_SIZE = IMAGE_W * IMAGE_H;
export const NUM_CHANNELS = 3;

/*
	Return image paths, and labels in the given directory
*/
export const getData = (dirs) => {
	const images = dirs.reduce((acc, dir) => {
		const batchSrcs = DIGITS.map((digit) => {
			return `${DATA_DIR}/${dir}/${digit}.png`;
		});
		return acc.concat(batchSrcs);
	}, []);

	const trainingBatchSize = dirs.length;
	const labels = new Array(trainingBatchSize).fill(0).reduce((acc) => {
		return acc.concat(LABELS);
	}, []);

	return {
		images,
		labels,
	};
}

export const getTrainingData = () => {
	return getData(TRAINING_DIRS);
};

export const getTestData = () => {
	return getData(TESTING_DIRS);
};