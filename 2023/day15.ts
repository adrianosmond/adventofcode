import readInput from '../utils/readInput.ts';
import { sum } from '../utils/reducers.ts';

const input = readInput();
const strings = input.split(',');

const hashString = (str: string) => {
  let value = 0;
  for (let i = 0; i < str.length; i++) {
    value += str.charCodeAt(i);
    value *= 17;
    value %= 256;
  }
  return value;
};

const operations: [string, number | null, number][] = strings
  .map((s) => s.split(/[-=]/))
  .map(([label, op]) => [
    label,
    op === '' ? null : parseInt(op, 10),
    hashString(label),
  ]);

type Box = Record<string, number>;
const boxes: Box[] = Array(256)
  .fill(0)
  .map(() => ({}));

const getFocusingPower = (box: Box, boxIndex: number) =>
  Object.values(box)
    .map(
      (focalLength, lensIndex) =>
        (boxIndex + 1) * (lensIndex + 1) * focalLength,
    )
    .reduce(sum, 0);

export const part1 = () => strings.map(hashString).reduce(sum);

export const part2 = () => {
  operations.forEach(([label, op, box]) => {
    if (op === null) {
      if (label in boxes[box]) delete boxes[box][label];
    } else {
      boxes[box][label] = op;
    }
  });

  return boxes.map(getFocusingPower).reduce(sum, 0);
};
