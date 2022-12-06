import { readInput } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();

const rounds = input.split('\n').map((round) => round.split(' '));

const getScore = ([p1, p2]) => {
  // Rock
  if (p1 === 'A') {
    if (p2 === 'X') return 1 + 3; // Rock
    if (p2 === 'Y') return 2 + 6; // Paper
    if (p2 === 'Z') return 3; // Scissors

    // Paper
  } else if (p1 === 'B') {
    if (p2 === 'X') return 1; // Rock
    if (p2 === 'Y') return 2 + 3; // Paper
    if (p2 === 'Z') return 3 + 6; // Scissors

    // Scissors
  } else if (p1 === 'C') {
    if (p2 === 'X') return 1 + 6; // Rock
    if (p2 === 'Y') return 2; // Paper
    if (p2 === 'Z') return 3 + 3; // Scissors
  }
};

const getScore2 = ([p1, outcome]) => {
  // Rock
  if (p1 === 'A') {
    if (outcome === 'X') return 3; // Lose
    if (outcome === 'Y') return 1 + 3; // Draw
    if (outcome === 'Z') return 2 + 6; // Win

    // Paper
  } else if (p1 === 'B') {
    if (outcome === 'X') return 1; // Lose
    if (outcome === 'Y') return 2 + 3; // Draw
    if (outcome === 'Z') return 3 + 6; // Win

    // Scissors
  } else if (p1 === 'C') {
    if (outcome === 'X') return 2; // Lose
    if (outcome === 'Y') return 3 + 3; // Draw
    if (outcome === 'Z') return 1 + 6; // Win
  }
};

const part1 = () => rounds.map(getScore).reduce(sum);

const part2 = () => rounds.map(getScore2).reduce(sum);

console.log('part1', part1());
console.log('part2', part2());