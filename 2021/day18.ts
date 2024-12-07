import readInput from '../utils/readInput.ts';

const input = readInput();

type SnailfishNumber = [number | SnailfishNumber, number | SnailfishNumber];

const replace = (
  number: SnailfishNumber,
  branch: number[] = [],
): [number | SnailfishNumber, number | SnailfishNumber, number[]] | false => {
  const depth = branch.length;
  for (let i = 0; i < 2; i++) {
    if (Array.isArray(number[i])) {
      branch.push(i);
      if (depth === 3) {
        const [left, right] = number[i] as SnailfishNumber;
        number[i] = 0;
        return [left, right, branch];
      }
      const result = replace(number[i] as SnailfishNumber, branch);
      if (result) return result;
      branch.pop();
    }
  }
  return false;
};

// This code treats the nested arrays as a binary tree where
// you can either go left (arr[0]) or right (arr[1]) until
// you reach a leaf node. We want to add add a number (toAdd)
// to the leaf node that came before/after the exploding pair.
// In order to do this we have the path taken to the exploding
// pair (branch) as a list of 0s and 1s. If we want to add to
// the leaf node before, we'll find the final time we went right,
// go left there instead, and if that's not a leaf node, keep going
// right until we reach one. If we want to add to  the leaf node
// after, we'll find the final time we went left, go right there
// instead, and if that's not a leaf node, keep going left until
// we reach one.
const addExploded = (
  number: SnailfishNumber,
  branch: number[],
  toAdd: number | SnailfishNumber,
  addBefore: boolean,
) => {
  const from = addBefore ? 1 : 0;
  const to = addBefore ? 0 : 1;
  let arr = number;
  branch.forEach((step, i) => {
    if (i < branch.lastIndexOf(from)) arr = arr[step] as SnailfishNumber;
  });
  if (!Array.isArray(arr[to])) {
    arr[to] += toAdd as number;
    return;
  }
  arr = arr[to];
  while (Array.isArray(arr[from])) {
    arr = arr[from];
  }
  arr[from] += toAdd as number;
};

const explode = (number: SnailfishNumber) => {
  const [left, right, branch] = replace(number) || [];
  if (!branch) return false;
  // if we ever took the right (1) branch in the tree,
  // there will be a number to the left of ours
  if (branch.includes(1)) {
    addExploded(number, branch, left as number | SnailfishNumber, true);
  }
  // if we ever took the left (0) branch in the tree,
  // there will be a number to the right of ours
  if (branch.includes(0)) {
    addExploded(number, branch, right as number | SnailfishNumber, false);
  }
  return true;
};

const split = (number: SnailfishNumber) => {
  for (let i = 0; i < 2; i++) {
    if (typeof number[i] === 'number') {
      if ((number[i] as number) >= 10) {
        const toSplit = number[i] as number;
        number[i] = [Math.floor(toSplit / 2), Math.ceil(toSplit / 2)];
        return true;
      }
    } else if (
      Array.isArray(number[i]) &&
      split(number[i] as SnailfishNumber)
    ) {
      return true;
    }
  }
  return false;
};

const reduce = (number: SnailfishNumber) => {
  while (true) {
    if (explode(number)) continue;
    if (split(number)) continue;
    break;
  }
  return number;
};

const add = (n1: SnailfishNumber, n2: SnailfishNumber) => reduce([n1, n2]);

const magnitude = (number: SnailfishNumber): number =>
  typeof number === 'number'
    ? number
    : 3 * magnitude(number[0] as SnailfishNumber) +
      2 * magnitude(number[1] as SnailfishNumber);

export const part1 = () =>
  magnitude(
    input
      .split('\n')
      .map((n) => JSON.parse(n))
      .reduce((total, current) => add(total, current)),
  );

export const part2 = () => {
  const numbers = input.split('\n');

  let max = 0;
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (i === j) continue;
      max = Math.max(
        max,
        magnitude(add(JSON.parse(numbers[i]), JSON.parse(numbers[j]))),
      );
    }
  }
  return max;
};
