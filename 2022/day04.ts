import readInput from '../utils/readInput.ts';

const input = readInput();
const pairs = input.split('\n').map<[number, number, number, number]>((p) => {
  const [, elf1Min, elf1Max, elf2Min, elf2Max] = p.match(
    /(\d+)-(\d+),(\d+)-(\d+)/,
  )!;
  return [
    parseInt(elf1Min, 10),
    parseInt(elf1Max, 10),
    parseInt(elf2Min, 10),
    parseInt(elf2Max, 10),
  ];
});

const isCompletelyContained = ([elf1Min, elf1Max, elf2Min, elf2Max]: [
  number,
  number,
  number,
  number,
]) =>
  (elf1Min <= elf2Min && elf1Max >= elf2Max) ||
  (elf2Min <= elf1Min && elf2Max >= elf1Max);

const hasOverlap = ([elf1Min, elf1Max, elf2Min, elf2Max]: [
  number,
  number,
  number,
  number,
]) =>
  (elf1Min <= elf2Min && elf1Max >= elf2Min) ||
  (elf2Min <= elf1Min && elf2Max >= elf1Min);

export const part1 = () => pairs.filter(isCompletelyContained).length;

export const part2 = () => pairs.filter(hasOverlap).length;
