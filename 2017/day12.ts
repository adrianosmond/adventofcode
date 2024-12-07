import readInput from '../utils/readInput.ts';
import { splitAndMapInputLines, strToIntArray } from '../utils/functions.ts';

const input = readInput();
const programs: Record<string, number[]> = splitAndMapInputLines(
  input,
  ' <-> ',
).reduce<Record<string, number[]>>(
  (acc, [key, values]) => ({
    ...acc,
    [key]: strToIntArray(values, ','),
  }),
  {},
);

export const part1 = () => {
  const queue: number[] = [0];
  const visited: number[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    visited.push(current);
    const children = programs[current];
    if (children === undefined) throw new Error('Children not found');
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (visited.includes(child) || queue.includes(child)) continue;
      queue.push(child);
    }
  }
  return visited.length;
};

export const part2 = () => {
  const queue: number[] = [];
  const visited: number[] = [];
  let groups = 0;
  for (let i = 0; i < Object.keys(programs).length; i++) {
    if (visited.includes(i)) continue;
    groups++;
    queue.push(i);
    while (queue.length > 0) {
      const current = queue.shift()!;
      visited.push(current);
      const children = programs[current];
      if (children === undefined) throw new Error('Children not found');
      for (let j = 0; j < children.length; j++) {
        const child = children[j];
        if (visited.includes(child) || queue.includes(child)) continue;
        queue.push(child);
      }
    }
  }
  return groups;
};
