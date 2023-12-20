import readInput from '../utils/readInput.js';
import { sum } from '../utils/reducers.js';

const input = readInput();

const rucksacks = input.split('\n');
const groups = [];
for (let i = 0; i < rucksacks.length; i += 3) {
  groups.push([rucksacks[i], rucksacks[i + 1], rucksacks[i + 2]]);
}

const getCompartments = (r) => [
  r.substring(0, r.length / 2),
  r.substring(r.length / 2),
];

const findCommonItems = ([first, ...others]) =>
  first.split('').find((c) => others.every((r) => r.includes(c)));

const getPriority = (char) => {
  const code = char.charCodeAt(0);
  return code > 96 ? code - 96 : code - 38;
};

const part1 = () =>
  rucksacks
    .map(getCompartments)
    .map(findCommonItems)
    .map(getPriority)
    .reduce(sum);

const part2 = () => groups.map(findCommonItems).map(getPriority).reduce(sum);

console.log('part1', part1());
console.log('part2', part2());
