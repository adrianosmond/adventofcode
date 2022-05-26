import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import md5 from 'spark-md5';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input17.txt'), 'utf8');

const isOpen = (char) => /[b-f]/.test(char);

const getNextNodes = ({ x, y, steps }) => {
  const nextNodes = [];
  const hash = md5.hashBinary(input + steps);
  if (isOpen(hash[0]) && y > 0) {
    nextNodes.push({ x, y: y - 1, steps: `${steps}U` });
  }
  if (isOpen(hash[1]) && y < 3) {
    nextNodes.push({ x, y: y + 1, steps: `${steps}D` });
  }
  if (isOpen(hash[2]) && x > 0) {
    nextNodes.push({ x: x - 1, y, steps: `${steps}L` });
  }
  if (isOpen(hash[3]) && x < 3) {
    nextNodes.push({ x: x + 1, y, steps: `${steps}R` });
  }
  return nextNodes;
};

const findPath = () => {
  const nodes = [{ x: 0, y: 0, steps: '' }];
  while (nodes.length > 0) {
    const node = nodes.shift();
    if (node.x === 3 && node.y === 3) {
      return node.steps;
    }
    nodes.push(...getNextNodes(node));
  }
};

const findLongestPath = () => {
  let longest = 0;
  const nodes = [{ x: 0, y: 0, steps: '' }];
  while (nodes.length > 0) {
    const node = nodes.shift();
    if (node.x === 3 && node.y === 3) {
      if (node.steps.length > longest) longest = node.steps.length;
      continue;
    }
    nodes.push(...getNextNodes(node));
  }
  return longest;
};

const part1 = () => findPath();

const part2 = () => findLongestPath();

console.log('part1', part1());
console.log('part2', part2());
