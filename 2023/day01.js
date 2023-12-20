import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();
const lines = input.split('\n');

const getCalibrationValue = (line) => {
  const digits = strToIntArray(line, '').filter(Boolean); // get rid of NaN
  return 10 * digits[0] + digits.at(-1);
};

// leave letters behind where they might form parts of
// overlapping numbers, e.g. eightwo
const replaceWordsWithNumbers = (line) =>
  line
    .replace(/one/g, 'o1e')
    .replace(/two/g, 't2o')
    .replace(/three/g, 't3e')
    .replace(/four/g, '4')
    .replace(/five/g, '5e')
    .replace(/six/g, '6')
    .replace(/seven/g, '7n')
    .replace(/eight/g, 'e8t')
    .replace(/nine/g, 'n9e');

export const part1 = () => lines.map(getCalibrationValue).reduce(sum);

export const part2 = () =>
  lines.map(replaceWordsWithNumbers).map(getCalibrationValue).reduce(sum);
