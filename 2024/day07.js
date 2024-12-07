import readInput from '../utils/readInput.js';
import { splitAndMapInputLines, strToIntArray } from '../utils/functions.js';

const input = readInput();
const equations = splitAndMapInputLines(input, ': ', (n, i) =>
  i === 0 ? parseInt(n, 10) : strToIntArray(n, ' '),
);

const concat = (a, b) => parseInt(`${a}${b}`, 10);

/**
 * @param {number} goal
 * @param {number[]} nums
 * @param {number} idx
 * @param {number} total
 * @param {boolean} [canConcat=false]
 * @returns {boolean}
 */
const isValidEquation = (goal, nums, idx, total, canConcat = false) => {
  if (total > goal) return false;
  if (idx === nums.length - 1) {
    return (
      total + nums[idx] === goal ||
      total * nums[idx] === goal ||
      (canConcat && concat(total, nums[idx]) === goal)
    );
  }
  return (
    isValidEquation(goal, nums, idx + 1, total + nums[idx], canConcat) ||
    isValidEquation(goal, nums, idx + 1, total * nums[idx], canConcat) ||
    (canConcat &&
      isValidEquation(goal, nums, idx + 1, concat(total, nums[idx]), canConcat))
  );
};

export const part1 = () =>
  equations.reduce(
    (total, [target, numbers]) =>
      total + (isValidEquation(target, numbers, 1, numbers[0]) ? target : 0),
    0,
  );

export const part2 = () =>
  equations.reduce(
    (total, [target, numbers]) =>
      total +
      (isValidEquation(target, numbers, 1, numbers[0], true) ? target : 0),
    0,
  );
