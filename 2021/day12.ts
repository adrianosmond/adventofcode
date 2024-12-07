import readInput from '../utils/readInput.ts';
import { splitAndMapInputLines } from '../utils/functions.ts';

const input = readInput();
const connections = splitAndMapInputLines(input, '-');
type Cave = {
  big: boolean;
  connections: string[];
};
const graph: Record<string, Cave> = {};
connections.forEach(([a, b]) => {
  if (!graph[a]) graph[a] = { big: a === a.toUpperCase(), connections: [b] };
  else graph[a].connections.push(b);

  if (!graph[b]) graph[b] = { big: b === b.toUpperCase(), connections: [a] };
  else graph[b].connections.push(a);
});

const getEmptyVisits = () =>
  Object.fromEntries(Object.keys(graph).map((key) => [key, 0]));

const hasDuplicate = (visits: Record<string, number>) =>
  Object.values(visits).includes(2);

const countPaths = (
  node: string,
  visits: Record<string, number>,
  allowDuplicates = false,
) => {
  if (node === 'end') return 1;

  let count = 0;
  graph[node].connections.forEach((nextNode) => {
    const isSmall = !graph[nextNode].big;
    const cantVisitSmall =
      visits[nextNode] > 0 && (allowDuplicates ? hasDuplicate(visits) : true);
    if (nextNode === 'start' || (isSmall && cantVisitSmall)) return;

    if (isSmall) visits[nextNode]++;
    count += countPaths(nextNode, visits, allowDuplicates);
    if (isSmall) visits[nextNode]--;
  });
  return count;
};

export const part1 = () => countPaths('start', getEmptyVisits());

export const part2 = () => countPaths('start', getEmptyVisits(), true);
