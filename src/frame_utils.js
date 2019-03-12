export function getFramePaths(basePath, numFrames = 10, extension = 'png') {
	 // construct paths to all frames
  const frameNames = new Array(numFrames).fill(0).map((_, i) => {
    const numberStr = (i + 1).toString();
    return numberStr.padStart(4, '0');;
  });

  const framePaths = frameNames.map((frame) => {
  	return `${basePath}${frame}.${extension}`;
  });

  return framePaths;
}