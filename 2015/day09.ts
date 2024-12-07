import readInput from '../utils/readInput.ts';
import { permutator } from '../utils/functions.ts';

const input = readInput();
const distances: Record<string, Record<string, number>> = {};
input.split('\n').forEach((line) => {
  const match = line.match(/(\w+) to (\w+) = (\d+)/);
  if (!match) return;
  const [, a, b, d] = match;
  if (!distances[a]) distances[a] = {};
  if (!distances[b]) distances[b] = {};
  distances[a][b] = parseInt(d, 10);
  distances[b][a] = distances[a][b];
});

const getLength = (route: string[]): number => {
  let distance = 0;
  for (let i = 1; i < route.length; i++) {
    distance += distances[route[i]][route[i - 1]];
  }
  return distance;
};

const options = permutator(Object.keys(distances));
const lengths = options.map(getLength);

export const part1 = () => Math.min(...lengths);

export const part2 = () => Math.max(...lengths);
