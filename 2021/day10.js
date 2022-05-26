import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { sum } from '../utils/reducers.js';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input10.txt'), 'utf8');
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

const part1 = () => invalidLines.reduce(sum);

const part2 = () => {
  const scores = incompleteLines
    .map((line) =>
      line.reduce(
        (total, current) => total * 5 + incompleteScores[closers[current]],
        0,
      ),
    )
    .sort((a, b) => a - b);

  return scores[Math.floor(scores.length / 2)];
};

console.log('part1', part1());
console.log('part2', part2());
