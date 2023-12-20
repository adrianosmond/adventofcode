import readInput from '../utils/readInput.js';
import { sum } from '../utils/reducers.js';

const input = readInput();
const strings = input.split(',');

const hashString = (str) => {
  let value = 0;
  for (let i = 0; i < str.length; i++) {
    value += str.charCodeAt(i);
    value *= 17;
    value %= 256;
  }
  return value;
};

const operations = strings
  .map((s) => s.split(/[-=]/))
  .map(([label, op]) => [
    label,
    op === '' ? null : parseInt(op, 10),
    hashString(label),
  ]);

const boxes = Array(256)
  .fill(0)
  .map(() => ({}));

const getFocusingPower = (box, boxIndex) =>
  Object.values(box)
    .map(
      (focalLength, lensIndex) =>
        (boxIndex + 1) * (lensIndex + 1) * focalLength,
    )
    .reduce(sum, 0);

const part1 = () => strings.map(hashString).reduce(sum);

const part2 = () => {
  operations.forEach(([label, op, box]) => {
    if (op === null) {
      if (label in boxes[box]) delete boxes[box][label];
    } else {
      boxes[box][label] = op;
    }
  });

  return boxes.map(getFocusingPower).reduce(sum, 0);
};

console.log('part1', part1());
console.log('part2', part2());
