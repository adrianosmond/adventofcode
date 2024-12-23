import readInput from '../utils/readInput.js';

const input = readInput();

const connections = input.split('\n').map((c) => c.split('-'));
const network = {};

connections.forEach(([from, to]) => {
  if (!network[from]) network[from] = {};
  if (!network[to]) network[to] = {};
  network[from][to] = true;
  network[to][from] = true;
});

const allNodes = Object.keys(network);

const findTrios = (start) => {
  const trios = [];
  const midNodes = Object.keys(network[start]);
  for (const midNode of midNodes) {
    const endNodes = Object.keys(network[midNode]);
    for (const endNode of endNodes) {
      if (midNodes.includes(endNode)) {
        const trio = [start, midNode, endNode];
        trio.sort();
        trios.push(trio.join(','));
      }
    }
  }
  return trios;
};

let largestClique = '';

// TIL: https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm
const findLargestClique = (
  clique = [],
  nodesToAdd = [...allNodes],
  alreadyTestedNodes = [],
) => {
  if (nodesToAdd.length === 0 && alreadyTestedNodes.length === 0) {
    const processed = clique.sort().join(',');
    if (processed.length > largestClique.length) largestClique = processed;
    return;
  }

  for (const node of nodesToAdd) {
    const newClique = [...clique];
    if (clique.indexOf(node) < 0) newClique.push(node);

    const newToAdd = [];
    const newTested = [];

    for (const neighbour of Object.keys(network[node])) {
      if (nodesToAdd.indexOf(neighbour) >= 0) newToAdd.push(neighbour);
      if (alreadyTestedNodes.indexOf(neighbour) >= 0) newTested.push(neighbour);
    }

    findLargestClique(newClique, newToAdd, newTested);

    nodesToAdd.splice(nodesToAdd.indexOf(node), 1);
    alreadyTestedNodes.push(node);
  }
};

export const part1 = () => {
  const uniqueTrios = new Set();

  Object.keys(network)
    .filter((k) => k.startsWith('t'))
    .forEach((start) => {
      findTrios(start).forEach((trio) => {
        uniqueTrios.add(trio);
      });
    });

  return uniqueTrios.size;
};

export const part2 = () => {
  findLargestClique();
  return largestClique;
};
