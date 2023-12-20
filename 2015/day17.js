import readInput from '../utils/readInput.js';
import { sortDesc, strToIntArray } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();
const TARGET = 150;
const containers = strToIntArray(input).sort(sortDesc);
const numCombinations = new Array(containers.length + 1).fill(0);

const findCombinations = (usedContainerIndices) => {
  const startIdx =
    usedContainerIndices.length === 0 ? -1 : usedContainerIndices.at(-1);
  const total = usedContainerIndices.reduce(
    (tot, idx) => tot + containers[idx],
    0,
  );

  for (let i = startIdx + 1; i < containers.length; i++) {
    if (containers[i] + total === TARGET) {
      numCombinations[usedContainerIndices.length + 1]++;
    } else if (containers[i] + total < TARGET) {
      findCombinations([...usedContainerIndices, i]);
    }
  }
};

findCombinations([]);

export const part1 = () => numCombinations.reduce(sum);

export const part2 = () => numCombinations.filter((p) => p > 0)[0];
