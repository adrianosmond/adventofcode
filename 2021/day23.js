import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { manhattan } from '../utils/functions.js';

const currentDir = dirname(fileURLToPath(import.meta.url));

let input = readFileSync(resolve(currentDir, 'input23.txt'), 'utf8');
input = input.substring(14, input.length - 12);

const goal = '#...........#\n###A#B#C#D###\n  #A#B#C#D#';
const goal2 =
  '#...........#\n###A#B#C#D###\n  #A#B#C#D#\n  #A#B#C#D#\n  #A#B#C#D#';

const amphipods = {
  A: { movement: 1, roomCol: 3 },
  B: { movement: 10, roomCol: 5 },
  C: { movement: 100, roomCol: 7 },
  D: { movement: 1000, roomCol: 9 },
};

const corridorCols = [1, 2, 4, 6, 8, 10, 11];

// Move the amphipod in the image from prevX,prevY -> newX,newY
const makeUpdatedState = (
  originalState,
  prevXPos,
  prevYPos,
  newXPos,
  newYPos,
  amphipod,
) => {
  const isNewPosFirst =
    newYPos < prevYPos || (prevYPos === newYPos && newXPos < prevXPos);
  const x1 = isNewPosFirst ? newXPos : prevXPos;
  const y1 = isNewPosFirst ? newYPos : prevYPos;
  const x2 = isNewPosFirst ? prevXPos : newXPos;
  const y2 = isNewPosFirst ? prevYPos : newYPos;
  const char1 = isNewPosFirst ? amphipod : '.';
  const char2 = isNewPosFirst ? '.' : amphipod;
  // deal with the fact that the room rows are narrower than the corridor row
  const start1 = x1 + (y1 > 2 ? 28 + (y1 - 2) * 12 : y1 * 14);
  const start2 = x2 + (y2 > 2 ? 28 + (y2 - 2) * 12 : y2 * 14);
  return (
    originalState.substring(0, start1) +
    char1 +
    originalState.substring(start1 + 1, start2) +
    char2 +
    originalState.substring(start2 + 1)
  );
};

const getNextStates = (state) => {
  const states = [];
  const grid = state.split('\n').map((r) => r.split(''));
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const cell = grid[y][x];
      if (cell !== 'A' && cell !== 'B' && cell !== 'C' && cell !== 'D')
        continue;

      const { roomCol, movement } = amphipods[cell];
      if (y === 0) {
        // if it's in the hallway, find out if it can move to its room
        let canMove = true;
        let lowestFreeRow = 1;

        for (let c = roomCol; c < x; c++) {
          if (grid[y][c] !== '.') canMove = false;
        }
        for (let c = x + 1; c <= roomCol; c++) {
          if (grid[y][c] !== '.') canMove = false;
        }

        for (let r = 1; r <= grid.length - 1; r++) {
          if (grid[r][roomCol] === '.') {
            lowestFreeRow = r;
          } else if (grid[r][roomCol] !== cell) {
            canMove = false;
          }
        }
        if (!canMove) continue;
        states.push([
          makeUpdatedState(state, x, y, roomCol, lowestFreeRow, cell),
          movement * manhattan([x, y], [roomCol, lowestFreeRow]),
        ]);
      } else {
        // if it's in a room, find out which places in the corridor it can move to
        let canMoveToCorridor = true;
        for (let r = y - 1; r >= 0; r--) {
          if (grid[r][x] !== '.') {
            canMoveToCorridor = false;
            break;
          }
        }
        if (!canMoveToCorridor) continue;
        const openSpots = [];
        for (let c = x; c >= 0; c--) {
          if (grid[0][c] === '.') {
            if (corridorCols.includes(c)) openSpots.push(c);
          } else break;
        }
        for (let c = x; c < grid[0].length; c++) {
          if (grid[0][c] === '.') {
            if (corridorCols.includes(c)) openSpots.push(c);
          } else break;
        }
        openSpots.forEach((o) => {
          states.push([
            makeUpdatedState(state, x, y, o, 0, cell),
            movement * manhattan([x, y], [o, 0]),
          ]);
        });
      }
    }
  }
  return states;
};

const solve = (start, end) => {
  const queue = [start];
  const distances = {
    [start]: 0,
  };
  let best = Number.MAX_SAFE_INTEGER;
  while (queue.length > 0) {
    const state = queue.shift();
    const distanceSoFar = distances[state];
    if (distanceSoFar >= best) continue;
    if (state === end) {
      best = Math.min(best, distanceSoFar);
      continue;
    }
    const nextStates = getNextStates(state);
    nextStates.forEach(([s, d]) => {
      if (
        typeof distances[s] === 'undefined' ||
        distances[s] > distanceSoFar + d
      ) {
        distances[s] = distanceSoFar + d;
        queue.push(s);
      }
    });
  }
  return best;
};

const part1 = () => solve(input, goal);

const part2 = () => {
  const rows = input.split('\n');
  rows.splice(2, 0, '  #D#C#B#A#', '  #D#B#A#C#');
  const modified = rows.join('\n');

  return solve(modified, goal2);
};

console.log('part1', part1());
console.log('part2', part2());
