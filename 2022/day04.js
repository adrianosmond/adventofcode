import { readInput } from '../utils/functions.js';

const input = readInput();
const pairs = input.split('\n').map((p) => {
  const [, elf1Min, elf1Max, elf2Min, elf2Max] = p.match(
    /(\d+)-(\d+),(\d+)-(\d+)/,
  );
  return [
    parseInt(elf1Min, 10),
    parseInt(elf1Max, 10),
    parseInt(elf2Min, 10),
    parseInt(elf2Max, 10),
  ];
});

const isCompletelyContained = ([elf1Min, elf1Max, elf2Min, elf2Max]) =>
  (elf1Min <= elf2Min && elf1Max >= elf2Max) ||
  (elf2Min <= elf1Min && elf2Max >= elf1Max);

const hasOverlap = ([elf1Min, elf1Max, elf2Min, elf2Max]) =>
  (elf1Min <= elf2Min && elf1Max >= elf2Min) ||
  (elf2Min <= elf1Min && elf2Max >= elf1Min);

const part1 = () => pairs.filter(isCompletelyContained).length;

const part2 = () => pairs.filter(hasOverlap).length;

console.log('part1', part1());
console.log('part2', part2());
