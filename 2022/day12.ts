import readInput from '../utils/readInput.ts';
import { getNeighbours } from '../utils/functions.ts';

type Coords = [number, number];
const input = readInput();
let start: Coords;
let end: Coords;

const map = input.split('\n').map((r, rIdx) =>
  r.split('').map((c, cIdx) => {
    const code = c.charCodeAt(0);
    // replace S with a
    if (code === 83) {
      start = [rIdx, cIdx];
      return 97;
    }
    // replace E with z
    if (code === 69) {
      end = [rIdx, cIdx];
      return 122;
    }
    return code;
  }),
);

const getShortestDistance = (grid: number[][], startPos: Coords) => {
  const bestDistances = new Array(grid.length)
    .fill(0)
    .map(() => new Array(grid[0].length).fill(Number.MAX_SAFE_INTEGER));
  bestDistances[startPos[0]][startPos[1]] = 0;

  const queue = [startPos];
  while (queue.length > 0) {
    const [row, col] = queue.shift()!;
    const currentHeight = map[row][col];
    const currentDistance = bestDistances[row][col];
    getNeighbours(grid, row, col).forEach(([r, c, height]) => {
      if (
        height - currentHeight <= 1 &&
        currentDistance + 1 < bestDistances[r][c]
      ) {
        queue.push([r, c]);
        bestDistances[r][c] = currentDistance + 1;
      }
    });
  }
  return bestDistances[end[0]][end[1]];
};

export const part1 = () => getShortestDistance(map, start);

export const part2 = () => {
  let best = Number.MAX_SAFE_INTEGER;
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[0].length; c++) {
      if (map[r][c] === 97) {
        best = Math.min(best, getShortestDistance(map, [r, c]));
      }
    }
  }
  return best;
};
