import readInput from '../utils/readInput.js';
import { sum } from '../utils/reducers.js';

const input = readInput();
const commands = input
  .replace(/\$ ls\n/g, '') // ignore ls commands
  .replace(/dir [a-z]+\n/g, '') // ignore directories - we'll get them with cd commands
  .split('\n');

const makePathString = (p) => p.join('/').replace('//', '/');

const DISK_SIZE = 70000000;
const SPACE_NEEDED = 30000000;
const sizes = {};

const path = [];
for (const command of commands) {
  if (command.startsWith('$ cd')) {
    const newDir = command.replace('$ cd ', '');
    if (newDir === '..') {
      path.pop();
    } else {
      path.push(newDir);
      sizes[makePathString(path)] = 0;
    }
  } else {
    const [size] = command.split(' ');
    path.forEach((_, idx) => {
      sizes[makePathString(path.slice(0, idx + 1))] += parseInt(size, 10);
    });
  }
}

const FREE_SPACE = DISK_SIZE - sizes['/'];

export const part1 = () =>
  Object.values(sizes)
    .filter((size) => size <= 100000)
    .reduce(sum);

export const part2 = () =>
  Object.values(sizes)
    .sort((a, b) => a - b)
    .find((v) => v >= SPACE_NEEDED - FREE_SPACE);
