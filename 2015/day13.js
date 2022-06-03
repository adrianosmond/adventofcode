import { readInput, permutator } from '../utils/functions.js';

const input = readInput();

const simplifiedInput = input
  .split('\n')
  .map((r) =>
    r
      .replace('happiness units by sitting next to ', '')
      .replace('would ', '')
      .replace('gain ', '')
      .replace('.', '')
      .replace('lose ', '-')
      .split(' '),
  )
  .map(([a, b, c]) => [a, parseInt(b, 10), c]);

const happinesses = {};
simplifiedInput.forEach(([a, score, b]) => {
  if (!happinesses[a]) happinesses[a] = {};
  happinesses[a][b] = score;
});

const getTotalHappiness = (scores, arrangement) => {
  let happiness = 0;
  for (let i = 0; i < arrangement.length - 1; i++) {
    happiness += scores[arrangement[i]][arrangement[i + 1]];
    happiness += scores[arrangement[i + 1]][arrangement[i]];
  }
  happiness += scores[arrangement[0]][arrangement[arrangement.length - 1]];
  happiness += scores[arrangement[arrangement.length - 1]][arrangement[0]];
  return happiness;
};

const getBestHappinessScore = (scores) => {
  const results = permutator(Object.keys(scores)).map((arrangement) =>
    getTotalHappiness(scores, arrangement),
  );
  let max = Number.MIN_SAFE_INTEGER;
  results.forEach((r) => {
    if (r > max) max = r;
  });
  return max;
};

const happinessesWithMe = JSON.parse(JSON.stringify(happinesses));
happinessesWithMe.Me = {};
Object.keys(happinesses).forEach((person) => {
  happinessesWithMe[person].Me = 0;
  happinessesWithMe.Me[person] = 0;
});

const part1 = () => getBestHappinessScore(happinesses);

const part2 = () => getBestHappinessScore(happinessesWithMe);

console.log('part1', part1());
console.log('part2', part2());
