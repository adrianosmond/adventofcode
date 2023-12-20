/* eslint-disable default-case */
/**
 * DISCLAIMER:
 * This is some of the worst code I've written in AoC. It's got a lot of hardcoding
 * to get a solution for my input, so it probably won't work for your input unless
 * it has the same shape as mine, which was:
 *   ##
 *   #
 *  ##
 *  #
 */
import readInput from '../utils/readInput.js';
import { inputToCharGrid } from '../utils/functions.js';

const input = readInput();
const [map, instructions] = input.split('\n\n');
const steps = instructions.replace(/([LR])/g, ',$1,').split(',');

const FACE_SIZE = 50;

const DIRECTIONS = {
  LEFT: [0, -1],
  RIGHT: [0, 1],
  UP: [-1, 0],
  DOWN: [1, 0],
};

const directionEquals = ([y1, x1], [y2, x2]) => y1 === y2 && x1 === x2;

const changeDirection = (direction, rotation) => {
  if (rotation === 'L') {
    if (directionEquals(direction, DIRECTIONS.RIGHT)) {
      return DIRECTIONS.UP;
    }
    if (directionEquals(direction, DIRECTIONS.UP)) {
      return DIRECTIONS.LEFT;
    }
    if (directionEquals(direction, DIRECTIONS.LEFT)) {
      return DIRECTIONS.DOWN;
    }
    if (directionEquals(direction, DIRECTIONS.DOWN)) {
      return DIRECTIONS.RIGHT;
    }
  }
  if (rotation === 'R') {
    if (directionEquals(direction, DIRECTIONS.RIGHT)) {
      return DIRECTIONS.DOWN;
    }
    if (directionEquals(direction, DIRECTIONS.UP)) {
      return DIRECTIONS.RIGHT;
    }
    if (directionEquals(direction, DIRECTIONS.LEFT)) {
      return DIRECTIONS.UP;
    }
    if (directionEquals(direction, DIRECTIONS.DOWN)) {
      return DIRECTIONS.LEFT;
    }
  }
};

const getScoreForDirection = ([y, x]) => {
  if (y === 0 && x === 1) return 0;
  if (y === 1 && x === 0) return 1;
  if (y === 0 && x === -1) return 2;
  if (y === -1 && x === 0) return 3;
};

const getFace = (grid, fy, fx) => {
  const face = [];
  for (let y = 0; y < FACE_SIZE; y++) {
    face.push([' ', ...grid[fy + y].slice(fx, fx + FACE_SIZE), ' ']);
  }
  face.push(new Array(FACE_SIZE + 2).fill(' '));
  face.unshift(new Array(FACE_SIZE + 2).fill(' '));
  return face;
};

const getFaces = () => {
  const faces = [];
  const grid = inputToCharGrid(map);

  for (let fy = 0; fy < grid.length; fy += FACE_SIZE) {
    for (let fx = 0; fx < grid[fy].length; fx += FACE_SIZE) {
      if (grid[fy][fx] !== ' ') {
        faces.push({
          id: faces.length,
          grid: getFace(grid, fy, fx),
          fx,
          fy,
        });
      }
    }
  }

  return faces;
};

const getMapCoordinates = (face, row, col) => [face.fy + row, face.fx + col];

// This part is hardcoded to work with my input :(
const moveToNewFace = (face, row, col, direction) => {
  if (directionEquals(direction, DIRECTIONS.RIGHT)) {
    // RIGHT
    switch (face.id) {
      case 0:
        return [1, row, 1, direction];
      case 1:
        return [4, FACE_SIZE - row + 1, FACE_SIZE, DIRECTIONS.LEFT];
      case 2:
        return [1, FACE_SIZE, row, DIRECTIONS.UP];
      case 3:
        return [4, row, 1, direction];
      case 4:
        return [1, FACE_SIZE - row + 1, FACE_SIZE, DIRECTIONS.LEFT];
      case 5:
        return [4, FACE_SIZE, row, DIRECTIONS.UP];
    }
  } else if (directionEquals(direction, DIRECTIONS.UP)) {
    // UP
    switch (face.id) {
      case 0:
        return [5, col, 1, DIRECTIONS.RIGHT];
      case 1:
        return [5, FACE_SIZE, col, direction];
      case 2:
        return [0, FACE_SIZE, col, direction];
      case 3:
        return [2, col, 1, DIRECTIONS.RIGHT];
      case 4:
        return [2, FACE_SIZE, col, direction];
      case 5:
        return [3, FACE_SIZE, col, direction];
    }
  } else if (directionEquals(direction, DIRECTIONS.LEFT)) {
    // LEFT
    switch (face.id) {
      case 0:
        return [3, FACE_SIZE - row + 1, 1, DIRECTIONS.RIGHT];
      case 1:
        return [0, row, FACE_SIZE, direction];
      case 2:
        return [3, 1, row, DIRECTIONS.DOWN];
      case 3:
        return [0, FACE_SIZE - row + 1, 1, DIRECTIONS.RIGHT];
      case 4:
        return [3, row, FACE_SIZE, direction];
      case 5:
        return [0, 1, row, DIRECTIONS.DOWN];
    }
  } else if (directionEquals(direction, DIRECTIONS.DOWN)) {
    // DOWN
    switch (face.id) {
      case 0:
        return [2, 1, col, direction];
      case 1:
        return [2, col, FACE_SIZE, DIRECTIONS.LEFT];
      case 2:
        return [4, 1, col, direction];
      case 3:
        return [5, 1, col, direction];
      case 4:
        return [5, col, FACE_SIZE, DIRECTIONS.LEFT];
      case 5:
        return [1, 1, col, direction];
    }
  }
  return [face, row, col, direction];
};

const part1 = () => {
  const mapWidth = Math.max(...map.split('\n').map((s) => s.length));
  const grid = map
    .split('\n')
    .map((row) => ` ${row.padEnd(mapWidth)} `.split(''));
  grid.push(new Array(grid[0].length).fill(' '));
  grid.unshift(new Array(grid[0].length).fill(' '));

  let row = 1;
  let col = grid[row].findIndex((cell) => cell === '.');
  let direction = DIRECTIONS.RIGHT;

  for (let step = 0; step < steps.length; step++) {
    if (step % 2 === 0) {
      const distance = parseInt(steps[step], 10);
      for (let i = 0; i < distance; i++) {
        const [y, x] = direction;
        if (grid[row + y][col + x] === '#') {
          break;
        } else if (grid[row + y][col + x] === ' ') {
          if (directionEquals(direction, DIRECTIONS.RIGHT)) {
            const wrapTo = grid[row].findIndex((cell) => cell !== ' ');
            if (grid[row][wrapTo] === '#') break;
            else col = wrapTo;
          } else if (directionEquals(direction, DIRECTIONS.UP)) {
            let wrapTo = grid.length - 1;
            while (grid[wrapTo][col] === ' ') wrapTo--;
            if (grid[wrapTo][col] === '#') break;
            else row = wrapTo;
          } else if (directionEquals(direction, DIRECTIONS.LEFT)) {
            let wrapTo = grid[row].length - 1;
            while (grid[row][wrapTo] === ' ') wrapTo--;
            if (grid[row][wrapTo] === '#') break;
            else col = wrapTo;
          } else if (directionEquals(direction, DIRECTIONS.DOWN)) {
            let wrapTo = 0;
            while (grid[wrapTo][col] === ' ') wrapTo++;
            if (grid[wrapTo][col] === '#') break;
            else row = wrapTo;
          }
        } else {
          row += y;
          col += x;
        }
      }
    } else {
      direction = changeDirection(direction, steps[step]);
    }
  }
  return 1000 * row + 4 * col + getScoreForDirection(direction);
};

const part2 = () => {
  const faces = getFaces();
  let direction = DIRECTIONS.RIGHT;
  let face = faces[0];
  let row = 1;
  let col = 1;

  for (let step = 0; step < steps.length; step++) {
    if (step % 2 === 0) {
      const distance = parseInt(steps[step], 10);
      for (let i = 0; i < distance; i++) {
        const [y, x] = direction;
        if (face.grid[row + y][col + x] === '#') {
          break;
        } else if (face.grid[row + y][col + x] === ' ') {
          const [nextFaceId, nextRow, nextCol, nextDirection] = moveToNewFace(
            face,
            row,
            col,
            direction,
          );
          const nextFace = faces[nextFaceId];
          if (nextFace.grid[nextRow][nextCol] === '#') break;
          face = nextFace;
          row = nextRow;
          col = nextCol;
          direction = nextDirection;
        } else {
          row += y;
          col += x;
        }
      }
    } else {
      direction = changeDirection(direction, steps[step]);
    }
  }

  const [finalRow, finalCol] = getMapCoordinates(face, row, col);

  return 1000 * finalRow + 4 * finalCol + getScoreForDirection(direction);
};

console.log('part1', part1());
console.log('part2', part2());
