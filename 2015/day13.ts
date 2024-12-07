import readInput from '../utils/readInput.ts';
import { permutator } from '../utils/functions.ts';

const input = readInput();

const toHappinessTuple = ([a, b, c]: string[]): [string, number, string] => [
  a,
  parseInt(b, 10),
  c,
];

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
  .map(toHappinessTuple);

const happinesses: Record<string, Record<string, number>> = {};
simplifiedInput.forEach(([a, score, b]) => {
  if (!happinesses[a]) happinesses[a] = {};
  happinesses[a][b] = score;
});

const getTotalHappiness = (
  scores: Record<string, Record<string, number>>,
  arrangement: string[],
) => {
  let happiness = 0;
  for (let i = 0; i < arrangement.length - 1; i++) {
    happiness += scores[arrangement[i]][arrangement[i + 1]];
    happiness += scores[arrangement[i + 1]][arrangement[i]];
  }
  happiness += scores[arrangement[0]][arrangement[arrangement.length - 1]];
  happiness += scores[arrangement[arrangement.length - 1]][arrangement[0]];
  return happiness;
};

const getBestHappinessScore = (
  scores: Record<string, Record<string, number>>,
) => {
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

export const part1 = () => getBestHappinessScore(happinesses);

export const part2 = () => getBestHappinessScore(happinessesWithMe);
