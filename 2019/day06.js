import readInput from '../utils/readInput.js';
import { splitAndMapInputLines } from '../utils/functions.js';

const input = readInput();
const orbits = splitAndMapInputLines(input, ')');
const chains = new Array(orbits.length);
const comIndex = orbits.findIndex((o) => o[0] === 'COM');
chains[comIndex] = [orbits[comIndex]];

const getParentIndex = (parent) => orbits.findIndex((o) => o[1] === parent);

const getChain = (start) => {
  const chain = [];
  let parentIndex = getParentIndex(start);
  const startIndex = parentIndex;
  while (!chains[parentIndex]) {
    const parent = orbits[parentIndex];
    chain.push(parent);
    parentIndex = getParentIndex(parent[0]);
  }
  chain.push(...chains[parentIndex]);
  chains[startIndex] = chain;
  return chain;
};

const getUniqueSegments = (chainA, chainB) => [
  ...chainA.filter((c) => !chainB.includes(c)),
  ...chainB.filter((c) => !chainA.includes(c)),
];

const numOrbits = orbits
  .map((o) => getChain(o[1]).length)
  .reduce((a, b) => a + b, 0);

const pathLength =
  getUniqueSegments(getChain('YOU'), getChain('SAN')).length - 2;

console.log('part1:', numOrbits);
console.log('part2:', pathLength);
