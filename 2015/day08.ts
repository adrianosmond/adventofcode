import readInput from '../utils/readInput.ts';
import { sum } from '../utils/reducers.ts';

const input = readInput();
const strings = input.split('\n');

const totalStringLength = strings.map((s) => s.length).reduce(sum);

const getUnescapedLength = (s: string) =>
  s
    .substr(1, s.length - 2)
    .replace(/\\x[0-9a-f]{2}/g, 'X')
    .replace(/\\\\/g, '\\')
    .replace(/\\"/g, '"').length;

const getEscapedLength = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').length + 2;

export const part1 = () =>
  totalStringLength - strings.map(getUnescapedLength).reduce(sum);

export const part2 = () =>
  strings.map(getEscapedLength).reduce(sum) - totalStringLength;
