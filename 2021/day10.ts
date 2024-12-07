import readInput from '../utils/readInput.ts';
import { sortAsc } from '../utils/functions.ts';
import { sum } from '../utils/reducers.ts';

const input = readInput();
const lines = input.split('\n');

type Opener = '{' | '[' | '(' | '<';
type Closer = '}' | ']' | ')' | '>';
const closers: Record<Opener, Closer> = {
  '{': '}',
  '[': ']',
  '(': ')',
  '<': '>',
};
const openers = Object.keys(closers) as Opener[];
const invalidScores: Record<Closer, number> = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};
const incompleteScores: Record<Closer, number> = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

const getCharsToClose = (line: string) => {
  const stack: Opener[] = [];
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (openers.includes(char as Opener)) {
      stack.push(char as Opener);
      continue;
    }

    const opener = stack.pop()!;
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
    return invalidScores[illegalChar as keyof typeof invalidScores];
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
