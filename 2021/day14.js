import readInput from '../utils/readInput.js';
import { splitAndMapInputLines } from '../utils/functions.js';

const input = readInput();
const [template, ins] = input.split('\n\n');
const insertions = Object.fromEntries(splitAndMapInputLines(ins, ' -> '));

const makeEmptyPairCount = () =>
  Object.fromEntries(Object.keys(insertions).map((key) => [key, 0]));

const makeStartState = () => {
  const count = makeEmptyPairCount();
  for (let i = 1; i < template.length; i++) {
    count[`${template[i - 1]}${template[i]}`]++;
  }
  return count;
};

const countSingleChars = (pairCounts) => {
  // Every character gets double counted as it appears as part of 2 pairs
  // except for the first and last ones. We'll start their count on 1
  // so every character count is double and we can just divide everything
  // by 2 at the end
  const count = {
    [template[0]]: 1,
    [template[template.length - 1]]: 1,
  };

  Object.entries(pairCounts).forEach(([[first, second], val]) => {
    if (count[first]) count[first] += val;
    else count[first] = val;
    if (count[second]) count[second] += val;
    else count[second] = val;
  });

  return Object.fromEntries(
    Object.entries(count).map(([char, ct]) => [char, ct / 2]),
  );
};

const getCharCountDifference = (numRounds) => {
  let pairCounts = makeStartState();

  for (let i = 1; i <= numRounds; i++) {
    const next = makeEmptyPairCount();
    Object.entries(pairCounts).forEach(([pair, count]) => {
      const toInsert = insertions[pair];
      next[`${pair[0]}${toInsert}`] += count;
      next[`${toInsert}${pair[1]}`] += count;
    });
    pairCounts = next;
  }

  const occurrences = Object.values(countSingleChars(pairCounts));
  return Math.max(...occurrences) - Math.min(...occurrences);
};

const part1 = () => getCharCountDifference(10);

const part2 = () => getCharCountDifference(40);

console.log('part1', part1());
console.log('part2', part2());
