import md5 from 'spark-md5';
import readInput from '../utils/readInput.ts';

const input = readInput();

const isOpen = (char: string) => /[b-f]/.test(char);

const getNextNodes = ({
  x,
  y,
  steps,
}: {
  x: number;
  y: number;
  steps: string;
}) => {
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
    const node = nodes.shift()!;
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
    const node = nodes.shift()!;
    if (node.x === 3 && node.y === 3) {
      if (node.steps.length > longest) longest = node.steps.length;
      continue;
    }
    nodes.push(...getNextNodes(node));
  }
  return longest;
};

export const part1 = () => findPath();

export const part2 = () => findLongestPath();
