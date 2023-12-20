import readInput from '../utils/readInput.js';

const input = readInput();
const target = parseInt(input, 10);
const max = 1000000;

export const part1 = () => {
  const houses = new Array(max).fill(0);
  for (let elf = 1; elf < max; elf++) {
    for (let house = elf; house < max; house += elf) {
      houses[house] += 10 * elf;
    }
  }
  return houses.findIndex((h) => h >= target);
};

export const part2 = () => {
  const houses = new Array(max).fill(0);
  for (let elf = 1; elf < max; elf++) {
    for (let house = elf; house < Math.min(max, elf + 50 * elf); house += elf) {
      houses[house] += 11 * elf;
    }
  }
  return houses.findIndex((h) => h >= target);
};
