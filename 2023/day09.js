import readInput from '../utils/readInput.js';
import { multilineStrToIntArrays } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();
const sequences = multilineStrToIntArrays(input);

const getDiffs = (sequence) => {
  const diffs = [];
  for (let i = 1; i < sequence.length; i++) {
    diffs.push(sequence[i] - sequence[i - 1]);
  }
  return diffs;
};

const getNextSequenceItem = (sequence) => {
  if (sequence[0] === 0 && sequence[1] === 0) return 0;
  const diffs = getDiffs(sequence);
  return sequence.at(-1) + getNextSequenceItem(diffs);
};

const getPrevSequenceItem = (sequence) => {
  if (sequence[0] === 0 && sequence[1] === 0) return 0;
  const diffs = getDiffs(sequence);
  return sequence[0] - getPrevSequenceItem(diffs);
};

export const part1 = () => sequences.map(getNextSequenceItem).reduce(sum);

export const part2 = () => sequences.map(getPrevSequenceItem).reduce(sum);
