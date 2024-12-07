import readInput from '../utils/readInput.ts';
import { multilineStrToIntArrays } from '../utils/functions.ts';
import { sum } from '../utils/reducers.ts';

const input = readInput();
const sequences = multilineStrToIntArrays(input);

const getDiffs = (sequence: number[]) => {
  const diffs = [];
  for (let i = 1; i < sequence.length; i++) {
    diffs.push(sequence[i] - sequence[i - 1]);
  }
  return diffs;
};

const getNextSequenceItem = (sequence: number[]): number => {
  if (sequence[0] === 0 && sequence[1] === 0) return 0;
  const diffs = getDiffs(sequence);
  return sequence.at(-1)! + getNextSequenceItem(diffs);
};

const getPrevSequenceItem = (sequence: number[]): number => {
  if (sequence[0] === 0 && sequence[1] === 0) return 0;
  const diffs = getDiffs(sequence);
  return sequence[0] - getPrevSequenceItem(diffs);
};

export const part1 = () => sequences.map(getNextSequenceItem).reduce(sum);

export const part2 = () => sequences.map(getPrevSequenceItem).reduce(sum);
