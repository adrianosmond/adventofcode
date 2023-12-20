import readInput from '../utils/readInput.js';
import { inputToCharGrid } from '../utils/functions.js';

const input = readInput();

const DIRECTIONS = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
};

const mapLight = (
  grid,
  beams,
  row = 0,
  col = 0,
  direction = DIRECTIONS.RIGHT,
) => {
  while (true) {
    // if we've exited the grid we can stop
    if (row < 0 || col < 0 || row >= grid.length || col >= grid[0].length)
      return;

    // if we've already been here in this direction there's no point repeating
    if (beams[row][col][direction]) return;

    beams[row][col][direction] = true;
    const cell = grid[row][col];
    if (cell === '/') {
      // mirror, so change course
      if (direction === DIRECTIONS.RIGHT) direction = DIRECTIONS.UP;
      else if (direction === DIRECTIONS.DOWN) direction = DIRECTIONS.LEFT;
      else if (direction === DIRECTIONS.UP) direction = DIRECTIONS.RIGHT;
      else if (direction === DIRECTIONS.LEFT) direction = DIRECTIONS.DOWN;
    } else if (cell === '\\') {
      // mirror, so change course
      if (direction === DIRECTIONS.RIGHT) direction = DIRECTIONS.DOWN;
      else if (direction === DIRECTIONS.DOWN) direction = DIRECTIONS.RIGHT;
      else if (direction === DIRECTIONS.UP) direction = DIRECTIONS.LEFT;
      else if (direction === DIRECTIONS.LEFT) direction = DIRECTIONS.UP;
    } else if (cell === '|') {
      // splitter, so split into 2 beams if we're coming at it perpendicularly
      if (direction === DIRECTIONS.RIGHT || direction === DIRECTIONS.LEFT) {
        mapLight(grid, beams, row - 1, col, DIRECTIONS.UP);
        mapLight(grid, beams, row + 1, col, DIRECTIONS.DOWN);
        // we've made 2 new paths, so we can end this one
        return;
      }
    } else if (cell === '-') {
      // splitter, so split into 2 beams if we're coming at it perpendicularly
      if (direction === DIRECTIONS.UP || direction === DIRECTIONS.DOWN) {
        mapLight(grid, beams, row, col - 1, DIRECTIONS.LEFT);
        mapLight(grid, beams, row, col + 1, DIRECTIONS.RIGHT);
        // we've made 2 new paths, so we can end this one
        return;
      }
    }

    if (direction === DIRECTIONS.RIGHT) col++;
    else if (direction === DIRECTIONS.DOWN) row++;
    else if (direction === DIRECTIONS.UP) row--;
    else if (direction === DIRECTIONS.LEFT) col--;
  }
};

const getEmptyGridAndBeams = () => {
  const grid = inputToCharGrid(input);
  const beams = grid.map((r) => r.map(() => [false, false, false, false]));
  return [grid, beams];
};

const countEnergisedBeams = (beams) =>
  beams.flat().reduce((total, cell) => total + (cell.some(Boolean) ? 1 : 0), 0);

const getEnergisedBeams = (row, col, direction) => {
  const [grid, beams] = getEmptyGridAndBeams();
  mapLight(grid, beams, row, col, direction);
  return countEnergisedBeams(beams);
};

export const part1 = () => getEnergisedBeams(0, 0, DIRECTIONS.RIGHT);

export const part2 = () => {
  const grid = inputToCharGrid(input);

  let max = 0;
  for (let row = 0; row < grid.length; row++) {
    max = Math.max(
      max,
      getEnergisedBeams(row, 0, DIRECTIONS.RIGHT),
      getEnergisedBeams(row, grid[0].length - 1, DIRECTIONS.LEFT),
    );
  }
  for (let col = 0; col < grid[0].length; col++) {
    max = Math.max(
      max,
      getEnergisedBeams(0, col, DIRECTIONS.DOWN),
      getEnergisedBeams(grid.length - 1, col, DIRECTIONS.UP),
    );
  }
  return max;
};
