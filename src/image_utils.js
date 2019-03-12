import * as tf from '@tensorflow/tfjs';

export function resizeImage(image, targetWidth, targetHeight) {
  return tf.image.resizeBilinear(image, [targetWidth, targetHeight]);
}

export function processImage(image) {
  const croppedImage = cropImageToSquare(image);
  const resizedImage = resizeImage(croppedImage, 224, 224);
  const batchedImage = batchImage(resizedImage);
  return batchedImage;
}

export function batchImage(image) {
	// Expand our tensor to have an additional dimension, whose size is 1
  const batchedImage = image.expandDims(0);
  
  // Turn pixel data into a float between -1 and 1.
  return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
}

/*  
  Crop image to squqare, as that's 
  required by tensorflow.js
*/
export function cropImageToSquare(img) {
  const width = img.shape[0];
  const height = img.shape[1];

   // use the shorter side as the crop size
  const shorterSide = Math.min(img.shape[0], img.shape[1]);
  
   // calculate beginning and ending crop points
  const startingHeight = (height - shorterSide) / 2;
  const startingWidth = (width - shorterSide) / 2;
  const endingHeight = startingHeight + shorterSide;
  const endingWidth = startingWidth + shorterSide;

   // return image data cropped to those points
  return img.slice([startingWidth, startingHeight, 0], [endingWidth, endingHeight, 3]);
}

/*
  Convert image data into tensor
*/
export function imageDataToTensor(imageData) {
  return tf.fromPixels(imageData);
}

/*
  Load img into canvas and return image data
*/
export async function getImageDataFromPath(imgPath) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const img = await loadImage(imgPath);

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0 );

  return ctx;
}

/*
  Load and process all the images and predict their number
*/
export function loadImages(images, pretrainedModel) {
  let promise = Promise.resolve();
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    promise = promise.then(data => {
      return loadImage(image).then(loadedImage => {
        return tf.tidy(() => {
          const imageTensor = tf.fromPixels(loadedImage);
          const processedImage = processImage(imageTensor);
          const imageMobilenetActivations = pretrainedModel.predict(processedImage);
          if (data) {
            const newData = data.concat(imageMobilenetActivations);
            data.dispose();
            return newData;
          }

          return tf.keep(imageMobilenetActivations);
        });
      });
    });
  }

  return promise;
}