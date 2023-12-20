import readInput from '../utils/readInput.js';
import { lcm } from '../utils/functions.js';

const input = readInput();

const map = {};
const [instructions, nodes] = input.split('\n\n');
nodes
  .split('\n')
  .map((line) =>
    line
      .replace(/[\s()]/g, '')
      .replace('=', ',')
      .split(','),
  )
  .forEach(([node, ...directions]) => {
    map[node] = directions;
  });

const getSteps = (startNode) => {
  let step = 0;
  let node = startNode;
  while (true) {
    const instruction = instructions[step % instructions.length];
    step++;
    if (instruction === 'L') node = map[node][0];
    else node = map[node][1];

    if (node.endsWith('Z')) return step;
  }
};

export const part1 = () => getSteps('AAA');

export const part2 = () =>
  lcm(
    Object.keys(map)
      .filter((node) => node.endsWith('A'))
      .map(getSteps),
  );
