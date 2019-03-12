import * as tf from '@tensorflow/tfjs';

import {
	resizeImage,
	batchImage,
	loadImage,
	cropImageToSquare,
	getImageDataFromPath,
	processImage,
} from './image_utils';
import { FOUR_DIGIT_SIZES } from './sizes';

const DIGIT_CANVAS_WIDTH = 8;
const DIGIT_CANVAS_HEIGHT = 10;

export function getNumberFromImageData(imageDataCtx, sizes) {
  const [offsetX, offsetY] = sizes;

  return imageDataCtx.getImageData(
    offsetX, offsetY,
    DIGIT_CANVAS_WIDTH, DIGIT_CANVAS_HEIGHT
  );
};

export async function classifyImageFromImageData(imageData) {
  //  classify each digit
  const sizes = FOUR_DIGIT_SIZES;
  const digits = await Promise.all(sizes.map(async(size, i) => {
    // adjust size with offset
    const localSize = [...size];
    const numberImageData = await getNumberFromImageData(imageData, localSize);
    return classifyImageData(numberImageData.imageData, i);
  }));

  const digitsString = digits.join('');
  return digitsString;
}

export function predict(model, loadedImage) {
  return model.predict(loadedImage);
}

/*
  Use pretrained model to make prediction about the digit in the passed pixel data
*/
export async function makeImageDataPrediction(pretrainedModel, trainedModel, imageData) {
  const imageTensor = tf.fromPixels(imageData);
  
  const processedImage = processImage(imageTensor);
  const imageMobilenetActivations = pretrainedModel.predict(processedImage);
  const prediction = predict(trainedModel, imageMobilenetActivations);

  const data = await prediction.as1D().argMax().data();
  return parseInt(data);
}

export async function predictNumber(pretrainedModel, trainedModel, numbersImageData) {
  return await Promise.all(
    numbersImageData.map(async(numberImageData) => {
      return await makeImageDataPrediction(pretrainedModel, trainedModel, numberImageData);
    })
  );
}

/*
  Predict 4 digits in the frame using pretrained model,
  concat result
*/
export async function predictFrame(imagePath, pretrainedModel, model) {
	const imageData = await getImageDataFromPath(imagePath);
  
  const numbers = new Array(4).fill(0).map((d, i) => {
    return getNumberFromImageData(imageData, FOUR_DIGIT_SIZES[i]);
  });
  
  const digits = await predictNumber(pretrainedModel, model, numbers);
  const number = digits.join('');
  
  return { imagePath, number };
}

/*
  Predict digits in a series of frames using the passed 
  pretrained model
*/
export function predictFrames(framesPaths, pretrainedModel, model) {
  return framesPaths.map(async(framePath) => {
    return predictFrame(framePath, pretrainedModel, model);
  });
} 