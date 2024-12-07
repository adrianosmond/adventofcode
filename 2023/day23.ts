import {
  getNeighbours,
  gridToCells,
  inputToCharGrid,
} from '../utils/functions.ts';
import readInput from '../utils/readInput.ts';

type Coord = [number, number];
const input = readInput();
const grid = inputToCharGrid(input);

const decisionPoints = gridToCells(grid)
  .filter(
    ([cell, row, col]) =>
      cell !== '#' &&
      getNeighbours(grid, row, col).filter(([, , c]) => c !== '#').length > 2,
  )
  .map(([, r, c]) => [r, c] as Coord);

decisionPoints.unshift([0, 1]);
decisionPoints.push([grid.length - 1, grid[0].length - 2]);

const findPath = (start: Coord, end: Coord, part2: boolean) => {
  const queue = [start];
  const best = new Array(grid.length)
    .fill(0)
    .map(() => new Array(grid[0].length).fill(Number.MAX_SAFE_INTEGER));

  best[start[0]][start[1]] = 0;

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const dist = best[r][c];
    if (r === end[0] && c === end[1]) return dist;
    getNeighbours(grid, r, c, true).forEach((n, dir) => {
      if (n === null) return;
      const [row, col, cell] = n;
      if (cell === '#') return;
      if (
        // if we find a decision point that isn't the one we're trying to get to, abandon
        decisionPoints.some(([dr, dc]) => dr === row && dc === col) &&
        (row !== end[0] || col !== end[1])
      )
        return;

      // ignore slopes for part 2
      if (!part2) {
        // if travelling in the wrong direction for a slope...
        if (dir === 0 && cell === '^') return; // 0 = down
        if (dir === 1 && cell === 'v') return; // 1 = up
        if (dir === 2 && cell === '<') return; // 2 = right
        if (dir === 3 && cell === '>') return; // 3 = left
      }

      if (best[row][col] > dist + 1) {
        queue.push([row, col]);
        best[row][col] = dist + 1;
      }
    });
  }
  return -1;
};

const calcDistances = (part2 = false) => {
  const distances = new Array(decisionPoints.length)
    .fill(0)
    .map(() => new Array(decisionPoints.length).fill(-1));

  for (let i = 0; i < decisionPoints.length; i++) {
    for (let j = 0; j < decisionPoints.length; j++) {
      if (i === j) continue;
      distances[i][j] = findPath(decisionPoints[i], decisionPoints[j], part2);
    }
  }

  return distances;
};

const currentPath: number[] = [];
const hasSeen: Record<number, boolean> = {};
const findLongestRoute = (distances: number[][], currentIdx = 0) => {
  if (currentIdx === distances.length - 1) return 0;

  let longest = Number.MIN_SAFE_INTEGER;
  currentPath.push(currentIdx);
  hasSeen[currentIdx] = true;
  for (let i = 0; i < distances.length; i++) {
    if (distances[currentIdx][i] < 0 || hasSeen[i]) continue;
    longest = Math.max(
      longest,
      findLongestRoute(distances, i) + distances[currentIdx][i],
    );
  }
  hasSeen[currentIdx] = false;
  currentPath.pop();

  return longest;
};

export const part1 = () => findLongestRoute(calcDistances());

export const part2 = () => findLongestRoute(calcDistances(true));
