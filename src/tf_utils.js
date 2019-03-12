import * as tf from '@tensorflow/tfjs';

import {
  resizeImage,
  batchImage,
  loadImage,
  loadImages,
  cropImageToSquare,
  getImageDataFromPath,
} from './image_utils';

export function getLabelsAsObject(labels) {
  let labelObject = {};
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    if (labelObject[label] === undefined) {
      // only assign it if we haven't seen it before
      labelObject[label] = Object.keys(labelObject).length;
    }
  }
  return labelObject;
}

export function addLabels(labels) {
  return tf.tidy(() => {
    const classes = getLabelsAsObject(labels);
    const classLength = Object.keys(classes).length;

    let ys;
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      const labelIndex = classes[label];
      const y = oneHot(labelIndex, classLength);
      if (i === 0) {
        ys = y;
      } else {
        ys = ys.concat(y, 0);
      }
    }
    return ys;
  });
};

export function oneHot(labelIndex, classLength) {
  return tf.tidy(() => tf.oneHot(tf.tensor1d([labelIndex]).toInt(), classLength));
};

export function loadMobilenet() {
	return tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
}

export function buildPretrainedModel() {
  return loadMobilenet().then((mobilenet) => {
    const layer = mobilenet.getLayer('conv_pw_13_relu');
    return tf.model({
      inputs: mobilenet.inputs,
      outputs: layer.output,
    });
  });
}

export function getModel(numberOfClasses) {
  const model = tf.sequential({
    layers: [
      tf.layers.flatten({inputShape: [7, 7, 256]}),
      tf.layers.dense({
        units: 100,
        activation: 'relu',
        kernelInitializer: 'varianceScaling',
        useBias: true
      }),
      tf.layers.dense({
        units: numberOfClasses,
        kernelInitializer: 'varianceScaling',
        useBias: false,
        activation: 'softmax'
      })
    ],
  });

  model.compile({
    optimizer: tf.train.adam(0.0001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

export async function loadPretrainedModel() {
	const pretrainedModel = await buildPretrainedModel();
  const model = await tf.loadModel('./model/pretrained-model.json');

  model.compile({
    optimizer: tf.train.adam(0.0001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return { pretrainedModel, model };
}

export async function trainModel(getTrainingData, getTestData, numClasses, onCallback) {
  const { images, labels } = getTrainingData();

  buildPretrainedModel().then(async(pretrainedModel) => {

    loadImages(images, pretrainedModel).then(async(xs) => {
      const ys = addLabels(labels);

      const model = getModel(numClasses);
      
      const validationSplit = 0.15;

      await model.fit(xs, ys, {
        epochs: 10,
        shuffle: true,
        validationSplit,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            console.log('onEpochEnd');
            onCallback(`Training: loss: ${logs.val_loss}, acc: ${logs.val_acc}`);
            await tf.nextFrame();
          }
        }
      });

      const { images: testImages, labels: testLabels } = getTestData();
      const testXs = await loadImages(testImages, pretrainedModel);


      const testYs = addLabels(testLabels);

      const testResult = model.evaluate(testXs, testYs);
      const testAccPercent = testResult[1].dataSync()[0] * 100;
      console.log(`Final validation accuracy: ${testAccPercent.toFixed(1)}%;`);


      await model.save('downloads://pretrained-model');
    });
  });
}