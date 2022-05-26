import { readInput } from '../utils/functions.js';

const input = readInput();

let [initialState, stateRules] = input
  .replace('initial state: ', '')
  .split('\n\n');

initialState = initialState.split('').map((x) => x === '#');
stateRules = stateRules.split('\n').map((rule) => rule.split(' => '));

const buffer = 150;
const minRepetitions = 10;
const bufferedPlants = [
  ...Array(buffer).fill(false),
  ...initialState,
  ...Array(buffer).fill(false),
];

const matchesPattern = (state, middle, pattern) =>
  state[middle - 2] === pattern[0] &&
  state[middle - 1] === pattern[1] &&
  state[middle] === pattern[2] &&
  state[middle + 1] === pattern[3] &&
  state[middle + 2] === pattern[4];

const rules = stateRules.map((r) => {
  const [pat, res] = r;
  const pattern = pat.split('').map((x) => x === '#');
  return (state, middle) =>
    matchesPattern(state, middle, pattern) ? res === '#' : null;
});

const transform = (state, middle) => {
  for (let i = 0; i < rules.length; i++) {
    const val = rules[i](state, middle);
    if (val !== null) {
      return val;
    }
  }
  throw new Error("Couldn't transform");
};

const countPlants = (plants) =>
  plants.reduce((acc, curr, idx) => acc + (curr ? idx - buffer : 0), 0);

const day12part1 = () => {
  const plants = [[...bufferedPlants], [...bufferedPlants]];

  let gen = 0;
  for (gen = 0; gen < 20; gen++) {
    const currentGenIdx = gen % 2;
    const nextGenIdx = (currentGenIdx + 1) % 2;
    const start = plants[currentGenIdx].indexOf(true) - 3;
    const end = plants[currentGenIdx].lastIndexOf(true) + 3;
    for (let i = start; i <= end; i++) {
      plants[nextGenIdx][i] = transform(plants[currentGenIdx], i);
    }
  }
  return countPlants(plants[gen % 2]);
};

const day12part2 = () => {
  const plants = [[...bufferedPlants], [...bufferedPlants]];

  let gen = 0;
  const diffs = Array(minRepetitions).fill(Number.MAX_SAFE_INTEGER);
  let prevCount = -1;

  while (gen < buffer) {
    const currentGenIdx = gen % 2;
    const nextGenIdx = (currentGenIdx + 1) % 2;
    const start = plants[currentGenIdx].indexOf(true) - 3;
    const end = plants[currentGenIdx].lastIndexOf(true) + 3;
    for (let i = start; i <= end; i++) {
      plants[nextGenIdx][i] = transform(plants[currentGenIdx], i);
    }
    const count = countPlants(plants[gen % 2]);
    if (prevCount > 0) {
      diffs[gen % diffs.length] = count - prevCount;
      if (diffs.filter((d) => d !== diffs[0]).length === 0) {
        return (50000000000 - gen) * diffs[0] + count;
      }
    }
    prevCount = count;
    gen++;
  }
  throw new Error(
    'No pattern found. Try increasing buffer and/or minRepetitions',
  );
};

console.log('part1:', day12part1());
console.log('part2:', day12part2());
