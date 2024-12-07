import readInput from '../utils/readInput.ts';
import { sum } from '../utils/reducers.ts';

const input = readInput();

const rucksacks = input.split('\n');
const groups: [string, string, string][] = [];
for (let i = 0; i < rucksacks.length; i += 3) {
  groups.push([rucksacks[i], rucksacks[i + 1], rucksacks[i + 2]]);
}

const getCompartments = (r: string) => [
  r.substring(0, r.length / 2),
  r.substring(r.length / 2),
];

const findCommonItems = ([first, ...others]: string[]) =>
  first.split('').find((c) => others.every((r) => r.includes(c)))!;

const getPriority = (char: string) => {
  const code = char.charCodeAt(0);
  return code > 96 ? code - 96 : code - 38;
};

export const part1 = () =>
  rucksacks
    .map(getCompartments)
    .map(findCommonItems)
    .map(getPriority)
    .reduce(sum);

export const part2 = () =>
  groups.map(findCommonItems).map(getPriority).reduce(sum);
