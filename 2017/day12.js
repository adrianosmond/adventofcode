import readInput from '../utils/readInput.js';
import { splitAndMapInputLines, strToIntArray } from '../utils/functions.js';

const input = readInput();
const programs = splitAndMapInputLines(input, ' <-> ').reduce(
  (acc, [key, values]) => ({
    ...acc,
    [key]: strToIntArray(values, ','),
  }),
  {},
);

export const part1 = () => {
  const queue = [0];
  const visited = [];

  while (queue.length > 0) {
    const current = queue.shift();
    visited.push(current);
    const children = programs[current];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (visited.includes(child) || queue.includes(child)) continue;
      queue.push(child);
    }
  }
  return visited.length;
};

export const part2 = () => {
  const queue = [];
  const visited = [];
  let groups = 0;
  for (let i = 0; i < Object.keys(programs).length; i++) {
    if (visited.includes(i)) continue;
    groups++;
    queue.push(i);
    while (queue.length > 0) {
      const current = queue.shift();
      visited.push(current);
      const children = programs[current];
      for (let j = 0; j < children.length; j++) {
        const child = children[j];
        if (visited.includes(child) || queue.includes(child)) continue;
        queue.push(child);
      }
    }
  }
  return groups;
};
