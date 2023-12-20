import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();
const winningNumbersPerCard = input
  .split('\n')
  .map((c) =>
    c
      .replace(/\s+/g, ' ')
      .replace(/Card \d+:\s/g, '')
      .split(' | ')
      .map((x) => strToIntArray(x, ' ')),
  )
  .map(([winners, myNumbers]) => winners.filter((w) => myNumbers.includes(w)));

const part1 = () =>
  winningNumbersPerCard
    .map((winningNumbers) =>
      winningNumbers.length === 0 ? 0 : 2 ** (winningNumbers.length - 1),
    )
    .reduce(sum);

const part2 = () => {
  const counts = Array(winningNumbersPerCard.length).fill(1);
  const scores = winningNumbersPerCard.map(
    (winningNumbers) => winningNumbers.length,
  );

  for (let i = 0; i < scores.length; i++) {
    for (let j = 1; j <= scores[i]; j++) {
      counts[i + j] += counts[i];
    }
  }

  return counts.reduce(sum);
};

console.log('part1', part1());
console.log('part2', part2());
