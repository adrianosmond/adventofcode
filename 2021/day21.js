const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input21.txt'), 'utf8');

let die = 1;
let numRolls = 0;

const parseInput = (i) =>
  i
    .split('\n')
    .map((r) => parseInt(r.match(/Player \d starting position: (\d)/)[1], 10));

const getRolls = () => {
  let score = 0;
  numRolls += 3;
  for (let i = 0; i < 3; i++) {
    score += die++;
    if (die > 100) die -= 100;
  }
  return score;
};

const part1 = () => {
  const positions = parseInput(input);
  const scores = new Array(positions.length).fill(0);

  while (true) {
    for (let i = 0; i < positions.length; i++) {
      positions[i] += getRolls() % 10;
      if (positions[i] > 10) {
        positions[i] -= 10;
      }
      scores[i] += positions[i];
      if (scores[i] >= 1000) {
        return scores[(i + 1) % 2] * numRolls;
      }
    }
  }
};

// The number of times each score can appear from 3 rolls
// Stored as [score, frequency]
const outcomeFrequencies = [
  [3, 1], // [1,1,1]
  [4, 3], // [1,1,2], [1,2,1], [2,1,1]
  [5, 6], // [1,2,2], [2,2,1], [2,1,2], [3,1,1], [1,1,3], [1,3,1]
  [6, 7], // [2,2,2], [1,2,3], [2,1,3], [3,2,1], [1,3,3], [3,3,1], [3,1,3]
  [7, 6], // [2,2,3], [2,3,2], [3,2,2], [3,3,1], [3,1,3], [1,3,3]
  [8, 3], // [2,3,3], [3,2,3], [3,3,2]
  [9, 1], // [1,1,1]
];

const countWins = (p, s, t) => {
  const wins = [0, 0];
  for (let i = 0; i < outcomeFrequencies.length; i++) {
    const [score, freq] = outcomeFrequencies[i];
    const pNext = [...p];
    const sNext = [...s];
    pNext[t] += score;
    if (pNext[t] > 10) pNext[t] -= 10;

    sNext[t] += pNext[t];
    if (sNext[t] >= 21) wins[t] += freq;
    else {
      const w1 = countWins(pNext, sNext, (t + 1) % 2);
      wins[0] += freq * w1[0];
      wins[1] += freq * w1[1];
    }
  }
  return wins;
};

const part2 = () => {
  const positions = parseInput(input);
  const scores = new Array(positions.length).fill(0);
  const wins = countWins(positions, scores, 0);
  return Math.max(...wins);
};

console.log('part1', part1());
console.log('part2', part2());
