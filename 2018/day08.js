import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';
import { sum, sumByKey } from '../utils/reducers.js';

const input = readInput();
const nodes = strToIntArray(input, ' ');

const countMetadata = (start, number) => {
  let count = 0;
  for (let i = start; i < start + number; i++) {
    count += nodes[i];
  }
  return count;
};

const findMetadata = (startIdx) => {
  let idx = startIdx;
  const numChildren = nodes[idx];
  const numMetadata = nodes[idx + 1];
  const children = [];
  idx += 2;
  for (let i = 0; i < numChildren; i++) {
    const child = findMetadata(idx);
    children.push(child);
    idx = child.end;
  }
  const sumMetadata =
    countMetadata(idx, numMetadata) + children.reduce(sumByKey('metadata'), 0);
  return {
    metadata: sumMetadata,
    end: idx + numMetadata,
  };
};

const getTreeValue = (tree) =>
  tree.children.length === 0
    ? tree.metadata.reduce(sum, 0)
    : tree.metadata.reduce(
        (p, c) =>
          p +
          (c > tree.children.length ? 0 : getTreeValue(tree.children[c - 1])),
        0,
      );

const makeTree = (startIdx, tree) => {
  let idx = startIdx;
  const numChildren = nodes[idx];
  const numMetadata = nodes[idx + 1];
  idx += 2;
  for (let i = 0; i < numChildren; i++) {
    const child = makeTree(idx, {
      children: [],
      metadata: [],
    });
    tree.children.push(child);
    idx = child.end;
  }
  return {
    ...tree,
    metadata: nodes.slice(idx, idx + numMetadata),
    end: idx + numMetadata,
  };
};

export const part1 = () => findMetadata(0).metadata;

export const part2 = () => {
  const tree = makeTree(0, {
    children: [],
    metadata: [],
  });
  return getTreeValue(tree);
};
