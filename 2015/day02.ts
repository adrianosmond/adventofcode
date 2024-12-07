import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';
import { sum } from '../utils/reducers.ts';

const input = readInput();
const dimensions = input
  .split('\n')
  .map(
    (r) =>
      strToIntArray(r, 'x').sort((a, b) => a - b) as [number, number, number],
  );

const getArea = ([w, h, l]: [number, number, number]) =>
  2 * w * h + 2 * h * l + 2 * l * w + w * h;

const getLength = ([w, h, l]: [number, number, number]) =>
  2 * w + 2 * h + w * h * l;

export const part1 = () => dimensions.map(getArea).reduce(sum);

export const part2 = () => dimensions.map(getLength).reduce(sum);
