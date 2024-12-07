import readInput from '../utils/readInput.ts';
import { inputToCharGrid, splitAndMapInputLines } from '../utils/functions.ts';

const input = readInput();

const STATES = {
  EMPTY: 'L',
  FLOOR: '.',
  OCCUPIED: '#',
};

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

let ADJACENCY_CACHE: ([number, number][] | undefined)[][];

const createAdjacencyCache = () => {
  ADJACENCY_CACHE = splitAndMapInputLines(input, '', () => undefined);
};

const isInGridBounds = (grid: unknown[][], row: number, col: number) =>
  row >= 0 && col >= 0 && row < grid.length && col < grid[0].length;

const getAdjacentSeatIndices = (
  grid: string[][],
  row: number,
  col: number,
  maxDistance: number,
) => {
  if (ADJACENCY_CACHE[row][col]) return ADJACENCY_CACHE[row][col];

  const adjacentSeats: [number, number][] = DIRECTIONS.map(([rDiff, cDiff]) => {
    let r = row + rDiff;
    let c = col + cDiff;
    let distance = 1;

    while (isInGridBounds(grid, r, c) && distance <= maxDistance) {
      if (grid[r][c] !== STATES.FLOOR) return [r, c] as [number, number];
      r += rDiff;
      c += cDiff;
      distance++;
    }

    return false;
  }).filter<[number, number]>((v) => v !== false);

  ADJACENCY_CACHE[row][col] = adjacentSeats;

  return adjacentSeats;
};

const getNextCellState = (
  grid: string[][],
  row: number,
  col: number,
  maxDistance = 1,
  tolerance = 4,
) => {
  const currentState = grid[row][col];
  if (currentState === STATES.FLOOR) return STATES.FLOOR;

  const numAdjacentOccupied = getAdjacentSeatIndices(
    grid,
    row,
    col,
    maxDistance,
  ).reduce(
    (total, [r, c]) => total + (grid[r][c] === STATES.OCCUPIED ? 1 : 0),
    0,
  );

  if (currentState === STATES.EMPTY && numAdjacentOccupied === 0) {
    return STATES.OCCUPIED;
  }

  if (currentState === STATES.OCCUPIED && numAdjacentOccupied >= tolerance) {
    return STATES.EMPTY;
  }

  return currentState;
};

const getNextLayout = (
  curr: string[][],
  prev: string[][],
  maxDistance = 1,
  tolerance = 4,
) => {
  let changed = false;

  for (let i = 0; i < prev.length; i++) {
    for (let j = 0; j < prev[i].length; j++) {
      curr[i][j] = getNextCellState(prev, i, j, maxDistance, tolerance);
      changed = changed || curr[i][j] !== prev[i][j];
    }
  }

  return changed;
};

const findStableState = (maxDistance = 1, tolerance = 4) => {
  createAdjacencyCache();

  const grids = [inputToCharGrid(input), inputToCharGrid(input)];
  let idx = 0;
  let changed = true;

  while (changed) {
    changed = getNextLayout(
      grids[idx % 2],
      grids[(idx + 1) % 2],
      maxDistance,
      tolerance,
    );
    idx++;
  }

  return grids[idx % 2]
    .flat()
    .reduce((total, cell) => total + (cell === STATES.OCCUPIED ? 1 : 0), 0);
};

export const part1 = () => findStableState();

export const part2 = () => findStableState(Number.MAX_SAFE_INTEGER, 5);
