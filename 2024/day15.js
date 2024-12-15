import readInput from '../utils/readInput.js';
import { gridToCells, inputToCharGrid } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const BOX = 'O';
const LBOX = '[';
const RBOX = ']';
const WALL = '#';
const EMPTY = '.';
const ROBOT = '@';
const DIRECTIONS = {
  '<': [0, -1],
  '^': [-1, 0],
  v: [1, 0],
  '>': [0, 1],
};

const input = readInput();
const [g, i] = input.split('\n\n');
const grid = inputToCharGrid(g);
const doubleGrid = grid.map((r) =>
  r
    .map((c) => {
      if (c === EMPTY) return [EMPTY, EMPTY];
      if (c === WALL) return [WALL, WALL];
      if (c === BOX) return [LBOX, RBOX];
      if (c === ROBOT) return [ROBOT, EMPTY];
      throw new Error('Found an unexpected cell');
    })
    .flat(),
);
const instructions = i.replace(/\n/g, '').split('');

const canBePushed = (row, col, direction) => {
  const [dr, dc] = direction;
  const nextRow = row + dr;
  let nextLCol;
  let nextRCol;
  if (doubleGrid[row][col] === LBOX) {
    nextLCol = col + dc;
    nextRCol = col + dc + 1;
  } else {
    nextLCol = col + dc - 1;
    nextRCol = col + dc;
  }
  const nextL = doubleGrid[nextRow][nextLCol];
  const nextR = doubleGrid[nextRow][nextRCol];
  if (nextL === WALL || nextR === WALL) return false;
  if (nextL === EMPTY && nextR === EMPTY) return true;
  if (nextL === LBOX) return canBePushed(nextRow, nextLCol, direction);
  if (nextL === RBOX && nextR === EMPTY)
    return canBePushed(nextRow, nextLCol, direction);
  if (nextL === EMPTY && nextR === LBOX)
    return canBePushed(nextRow, nextRCol, direction);
  if (nextL === RBOX && nextR === LBOX)
    return (
      canBePushed(nextRow, nextLCol, direction) &&
      canBePushed(nextRow, nextRCol, direction)
    );
};

const pushBox = (row, col, direction) => {
  const [dr, dc] = direction;
  const nextRow = row + dr;
  let lCol;
  let rCol;
  if (doubleGrid[row][col] === LBOX) {
    lCol = col + dc;
    rCol = col + dc + 1;
  } else {
    lCol = col + dc - 1;
    rCol = col + dc;
  }
  const nextL = doubleGrid[nextRow][lCol];
  const nextR = doubleGrid[nextRow][rCol];

  if (nextL === LBOX) {
    pushBox(nextRow, lCol, direction);
  }
  if (nextL === RBOX && nextR === EMPTY) {
    pushBox(nextRow, lCol, direction);
  }
  if (nextL === EMPTY && nextR === LBOX) {
    pushBox(nextRow, rCol, direction);
  }
  if (nextL === RBOX && nextR === LBOX) {
    pushBox(nextRow, lCol, direction);
    pushBox(nextRow, rCol, direction);
  }

  doubleGrid[nextRow][lCol] = LBOX;
  doubleGrid[nextRow][rCol] = RBOX;
  doubleGrid[row][lCol] = EMPTY;
  doubleGrid[row][rCol] = EMPTY;
};

export const part1 = () => {
  const robotIdx = grid.flat().indexOf(ROBOT);
  let row = Math.floor(robotIdx / grid[0].length);
  let col = robotIdx % grid[0].length;
  grid[row][col] = '.';
  instructions.forEach((instr) => {
    const dir = DIRECTIONS[instr];
    const nextR = row + dir[0];
    const nextC = col + dir[1];
    if (grid[nextR][nextC] === WALL) return;
    if (grid[nextR][nextC] === EMPTY) {
      row = nextR;
      col = nextC;
      return;
    }
    let endR = nextR + dir[0];
    let endC = nextC + dir[1];
    for (let dist = 2; grid[endR][endC] === BOX; dist++) {
      endR = nextR + dist * dir[0];
      endC = nextC + dist * dir[1];
    }
    if (grid[endR][endC] === WALL) {
      return;
    }
    grid[nextR][nextC] = EMPTY;
    grid[endR][endC] = BOX;
    row = nextR;
    col = nextC;
  });

  return gridToCells(grid)
    .map(([v, r, c]) => (v !== BOX ? 0 : r * 100 + c))
    .reduce(sum);
};

export const part2 = () => {
  const robotIdx = doubleGrid.flat().indexOf(ROBOT);
  let row = Math.floor(robotIdx / doubleGrid[0].length);
  let col = robotIdx % doubleGrid[0].length;
  doubleGrid[row][col] = '.';
  instructions.forEach((instr) => {
    const dir = DIRECTIONS[instr];
    const nextR = row + dir[0];
    const nextC = col + dir[1];
    if (doubleGrid[nextR][nextC] === WALL) return;
    if (doubleGrid[nextR][nextC] === EMPTY) {
      row = nextR;
      col = nextC;
      return;
    }

    if (instr === '<' || instr === '>') {
      let endC = nextC + dir[1];
      for (
        let dist = 2;
        doubleGrid[row][endC] === LBOX || doubleGrid[row][endC] === RBOX;
        dist++
      ) {
        endC = nextC + dist * dir[1];
      }
      if (doubleGrid[row][endC] === WALL) return;
      for (let j = endC; j !== col; j -= dir[1]) {
        doubleGrid[row][j] = doubleGrid[row][j - dir[1]];
      }
      doubleGrid[row][nextC] = EMPTY;
    } else {
      if (!canBePushed(nextR, nextC, dir)) return;
      pushBox(nextR, nextC, dir);
    }
    row = nextR;
    col = nextC;
  });

  return gridToCells(doubleGrid)
    .map(([v, r, c]) => (v !== LBOX ? 0 : r * 100 + c))
    .reduce(sum);
};
