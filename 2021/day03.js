import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input03.txt'), 'utf8');
const numbers = input.split('\n');
const numBits = numbers[0].length;

const countBitFrequency = (nums, pos) => {
  const count = [0, 0];
  for (let i = 0; i < nums.length; i++) {
    count[parseInt(nums[i][pos], 10)]++;
  }
  return count;
};

const getMCB = (nums, pos) => {
  const [zeros, ones] = countBitFrequency(nums, pos);
  return zeros > ones ? 0 : 1;
};

const getLCB = (nums, pos) => {
  const [zeros, ones] = countBitFrequency(nums, pos);
  return ones < zeros ? 1 : 0;
};

const part1 = () => {
  let gamma = '';
  let epsilon = '';
  for (let i = 0; i < numBits; i++) {
    gamma += getMCB(numbers, i);
    epsilon += getLCB(numbers, i);
  }
  return parseInt(gamma, 2) * parseInt(epsilon, 2);
};

const filterNumbers = (getBit) => {
  let filtered = [...numbers];
  for (let i = 0; filtered.length > 1; i++) {
    const bit = getBit(filtered, i);
    filtered = filtered.filter((num) => num[i] === `${bit}`);
  }
  return filtered[0];
};

const part2 = () => {
  const o2 = filterNumbers(getMCB);
  const co2 = filterNumbers(getLCB);
  return parseInt(o2, 2) * parseInt(co2, 2);
};

console.log('part1', part1());
console.log('part2', part2());
