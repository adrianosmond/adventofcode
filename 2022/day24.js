import readInput from '../utils/readInput.js';
import {
  getNeighbours,
  manhattan,
  inputToCharGrid,
} from '../utils/functions.js';

const input = readInput();

const DIRECTIONS = {
  LEFT: [0, -1],
  RIGHT: [0, 1],
  UP: [-1, 0],
  DOWN: [1, 0],
};

const startingGrid = inputToCharGrid(input);
const blizzards = startingGrid
  .map((row, rowIdx) =>
    row.map((cell, colIdx) => {
      if (cell === 'v') {
        return {
          row: rowIdx,
          col: colIdx,
          direction: DIRECTIONS.DOWN,
        };
      }
      if (cell === '>') {
        return {
          row: rowIdx,
          col: colIdx,
          direction: DIRECTIONS.RIGHT,
        };
      }
      if (cell === '<') {
        return {
          row: rowIdx,
          col: colIdx,
          direction: DIRECTIONS.LEFT,
        };
      }
      if (cell === '^') {
        return {
          row: rowIdx,
          col: colIdx,
          direction: DIRECTIONS.UP,
        };
      }
      return null;
    }),
  )
  .flat()
  .filter(Boolean);

const moveBlizzards = () => {
  blizzards.forEach((b) => {
    b.row += b.direction[0];
    if (b.row === 0) {
      b.row = startingGrid.length - 2;
    }
    if (b.row === startingGrid.length - 1) {
      b.row = 1;
    }
    b.col += b.direction[1];
    if (b.col === 0) {
      b.col = startingGrid[0].length - 2;
    }
    if (b.col === startingGrid[0].length - 1) {
      b.col = 1;
    }
  });
};

const makeGrid = () => {
  const blizzardPositions = Object.fromEntries(
    blizzards.map((b) => [`${b.row},${b.col}`, b]),
  );
  const grid = [...startingGrid.map((r) => [...r])];
  for (let r = 1; r < grid.length - 1; r++) {
    for (let c = 1; c < grid[r].length - 1; c++) {
      const bliz = blizzardPositions[`${r},${c}`];
      if (bliz) {
        grid[r][c] = '#';
      } else {
        grid[r][c] = '.';
      }
    }
  }
  return grid;
};

const makeGrids = () => {
  const grids = [startingGrid];
  const startStateKey = JSON.stringify(blizzards);

  while (true) {
    moveBlizzards();
    if (JSON.stringify(blizzards) === startStateKey) break;
    grids.push(makeGrid());
  }

  return grids;
};

const createMapArray = (numRepeats, val, grid) => {
  const mapArray = [];
  for (let r = 0; r < numRepeats; r++) {
    const map = [];
    for (let i = 0; i < grid.length; i++) {
      const row = [];
      for (let j = 0; j < grid[0].length; j++) {
        row.push(val);
      }
      map.push(row);
    }
    mapArray.push(map);
  }
  return mapArray;
};

const grids = makeGrids();
const entrance = [0, 1];
const exit = [grids[0].length - 1, grids[0][0].length - 2];

const findPath = (start, end, startTime) => {
  const openSet = [
    {
      row: start[0],
      col: start[1],
      time: startTime,
    },
  ];
  const gScore = createMapArray(
    grids.length,
    Number.MAX_SAFE_INTEGER,
    grids[0],
  );
  gScore[startTime % grids.length][start[0]][start[1]] = 0;
  const fScore = createMapArray(
    grids.length,
    Number.MAX_SAFE_INTEGER,
    grids[0],
  );
  fScore[startTime % grids.length][start[0]][start[1]] = manhattan(start, end);

  while (openSet.length > 0) {
    openSet.sort(
      (a, b) =>
        fScore[a.time % grids.length][a.row][a.col] -
        fScore[b.time % grids.length][b.row][b.col],
    );

    const { row, col, time } = openSet.shift();

    if (row === end[0] && col === end[1]) {
      return time;
    }

    const nextTime = (time + 1) % grids.length;
    const nextGrid = grids[nextTime];

    [
      ...getNeighbours(nextGrid, row, col),
      [row, col, nextGrid[row][col]],
    ].forEach(([r, c, val]) => {
      if (val === '.') {
        const tentativeGScore = gScore[time % grids.length][row][col] + 1;
        if (tentativeGScore < gScore[nextTime][r][c]) {
          gScore[nextTime][r][c] = tentativeGScore;
          fScore[nextTime][r][c] = tentativeGScore + manhattan([r, c], end);

          if (
            !openSet.includes(
              (pos) => pos.row === r && pos.col === c && pos.time === time + 1,
            )
          ) {
            openSet.push({
              row: r,
              col: c,
              time: time + 1,
            });
          }
        }
      }
    });
  }
};

export const part1 = () => findPath(entrance, exit, 0);

export const part2 = () => {
  const p1 = findPath(entrance, exit, 0);
  const p2 = findPath(exit, entrance, p1);
  return findPath(entrance, exit, p2);
};
