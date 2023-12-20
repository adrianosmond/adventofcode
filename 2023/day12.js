import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();

const springs = input.split('\n').map((s) => {
  const [records, groups] = s.split(' ');
  return [records, strToIntArray(groups, ',')];
});

const makeKey = (...args) => args.join(',');

const getArrangements = (
  records,
  groups,
  cache = {},
  pos = 0,
  currentGroup = 0,
  currentGroupLength = 0,
) => {
  const key = makeKey(pos, currentGroup, currentGroupLength);
  if (key in cache) return cache[key];

  let newArrangements = 0;

  if (pos === records.length) {
    if (
      (currentGroup === groups.length && currentGroupLength === 0) ||
      (currentGroup === groups.length - 1 &&
        currentGroupLength === groups.at(-1))
    ) {
      newArrangements = 1;
    }
  } else {
    if (records[pos] === '.' || records[pos] === '?') {
      if (currentGroupLength === groups[currentGroup]) {
        newArrangements += getArrangements(
          records,
          groups,
          cache,
          pos + 1,
          currentGroup + 1,
          0,
        );
      } else if (currentGroupLength === 0) {
        newArrangements += getArrangements(
          records,
          groups,
          cache,
          pos + 1,
          currentGroup,
          0,
        );
      }
    }
    if (records[pos] === '#' || records[pos] === '?') {
      if (currentGroupLength < groups[currentGroup]) {
        newArrangements += getArrangements(
          records,
          groups,
          cache,
          pos + 1,
          currentGroup,
          currentGroupLength + 1,
        );
      }
    }
  }

  cache[key] = newArrangements;

  return newArrangements;
};

const unfold = (records, groups, numTimes = 1) => [
  Array(numTimes).fill(records).join('?'),
  Array(numTimes).fill(groups).flat(),
];

export const part1 = () =>
  springs
    .map(([records, groups]) => getArrangements(records, groups))
    .reduce(sum);

export const part2 = () =>
  springs
    .map(([records, groups]) => unfold(records, groups, 5))
    .map(([records, groups]) => getArrangements(records, groups))
    .reduce(sum);
