import readInput from '../utils/readInput.js';
import { sum } from '../utils/reducers.js';

const input = readInput();
const strings = input.split('\n');

const totalStringLength = strings.map((s) => s.length).reduce(sum);

const getUnescapedLength = (s) =>
  s
    .substr(1, s.length - 2)
    .replace(/\\x[0-9a-f]{2}/g, 'X')
    .replace(/\\\\/g, '\\')
    .replace(/\\"/g, '"').length;

const getEscapedLength = (s) =>
  s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').length + 2;

export const part1 = () =>
  totalStringLength - strings.map(getUnescapedLength).reduce(sum);

export const part2 = () =>
  strings.map(getEscapedLength).reduce(sum) - totalStringLength;
