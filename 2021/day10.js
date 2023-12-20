import readInput from '../utils/readInput.js';
import { sortAsc } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();
const lines = input.split('\n');

const closers = {
  '{': '}',
  '[': ']',
  '(': ')',
  '<': '>',
};
const openers = Object.keys(closers);
const invalidScores = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};
const incompleteScores = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

const getCharsToClose = (line) => {
  const stack = [];
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (openers.includes(char)) {
      stack.push(char);
      continue;
    }

    const opener = stack.pop();
    if (char !== closers[opener]) {
      throw char;
    }
  }
  return stack.reverse();
};

const parsedLines = lines.map((line) => {
  try {
    return getCharsToClose(line);
  } catch (illegalChar) {
    return invalidScores[illegalChar];
  }
});

const invalidLines = parsedLines.filter((line) => typeof line === 'number');
const incompleteLines = parsedLines.filter((line) => typeof line === 'object');

export const part1 = () => invalidLines.reduce(sum);

export const part2 = () => {
  const scores = incompleteLines
    .map((line) =>
      line.reduce(
        (total, current) => total * 5 + incompleteScores[closers[current]],
        0,
      ),
    )
    .sort(sortAsc);

  return scores[Math.floor(scores.length / 2)];
};
