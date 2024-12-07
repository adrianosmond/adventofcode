import readInput from '../utils/readInput.ts';

const input = readInput();
const numbers = input.split('\n');
const numBits = numbers[0].length;

const countBitFrequency = (nums: string[], pos: number) => {
  const count = [0, 0];
  for (let i = 0; i < nums.length; i++) {
    count[parseInt(nums[i][pos], 10)]++;
  }
  return count;
};

const getMCB = (nums: string[], pos: number) => {
  const [zeros, ones] = countBitFrequency(nums, pos);
  return zeros > ones ? 0 : 1;
};

const getLCB = (nums: string[], pos: number) => {
  const [zeros, ones] = countBitFrequency(nums, pos);
  return ones < zeros ? 1 : 0;
};

const filterNumbers = (getBit: (nums: string[], pos: number) => 0 | 1) => {
  let filtered = [...numbers];
  for (let i = 0; filtered.length > 1; i++) {
    const bit = getBit(filtered, i);
    filtered = filtered.filter((num) => num[i] === `${bit}`);
  }
  return filtered[0];
};

export const part1 = () => {
  let gamma = '';
  let epsilon = '';
  for (let i = 0; i < numBits; i++) {
    gamma += getMCB(numbers, i);
    epsilon += getLCB(numbers, i);
  }
  return parseInt(gamma, 2) * parseInt(epsilon, 2);
};

export const part2 = () => {
  const o2 = filterNumbers(getMCB);
  const co2 = filterNumbers(getLCB);
  return parseInt(o2, 2) * parseInt(co2, 2);
};
