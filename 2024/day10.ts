import readInput from '../utils/readInput.ts';
import {
  inputToIntGrid,
  gridToCells,
  getNeighbours,
} from '../utils/functions.ts';
import { sum } from '../utils/reducers.ts';

const input = readInput();
const grid = inputToIntGrid(input);

const trailheads: number[][] = gridToCells(grid)
  .filter(([height]) => height === 0)
  .map(([, r, c]) => [r, c]);

const getPossibleNextSteps = (
  row: number,
  col: number,
  currentHeight: number,
) =>
  getNeighbours(grid, row, col).filter(
    ([, , val]) => val === currentHeight + 1,
  );

const findTrails = (
  [row, col]: number[],
  trailsFound: Record<string, boolean> = {},
) => {
  const currentHeight = grid[row][col];

  if (currentHeight === 9) {
    trailsFound[`${row},${col}`] = true;
    return trailsFound;
  }

  getPossibleNextSteps(row, col, currentHeight).map((t) =>
    findTrails(t, trailsFound),
  );

  return trailsFound;
};

const findTrailheadRatings = ([row, col]: number[]): number => {
  const currentHeight = grid[row][col];

  if (currentHeight === 9) return 1;

  return getPossibleNextSteps(row, col, currentHeight)
    .map(findTrailheadRatings)
    .reduce(sum, 0);
};

export const part1 = () =>
  trailheads.map((t) => Object.keys(findTrails(t))).flat().length;

export const part2 = () => trailheads.map(findTrailheadRatings).reduce(sum);
