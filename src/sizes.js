/*
  Position of the top decibel label in the following format:
  [x, y, width, height]
 */
const FIRST_DIGIT = [929, 37, 8, 10];
const SECOND_DIGIT = [935.5, 37, 8, 10];
const THIRD_DIGIT = [944.5, 37, 8, 10];
const FOURTH_DIGIT = [951, 37, 8, 10];

/*
  Array of positions if we're dealing with a four digit number. E.g. 84.20.
 */
export const FOUR_DIGIT_SIZES = [
  FIRST_DIGIT, SECOND_DIGIT, THIRD_DIGIT, FOURTH_DIGIT,
];