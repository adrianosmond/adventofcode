import { readInput, inputToCharGrid } from '../utils/functions.js';

const input = inputToCharGrid(readInput());

const VERTICAL = '|';
const HORIZONTAL = '-';
const INTERSECTION = '+';
const TL_BR = '/'; // Top left / Bottom right
const TR_BL = '\\'; // Top right / Bottom left

// [col movement, row movement]
const movements = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

// Turn first left, then don't turn, then turn right
const nextDirection = [3, 0, 1];

const carts = [];
let firstCrash;

for (let i = 0; i < input.length; i++) {
  const row = input[i];
  for (let j = 0; j < row.length; j++) {
    const char = input[i][j];
    const c = { row: i, col: j, turns: 0 };
    if (char === '^') {
      carts.push({
        ...c,
        direction: 0, // Up = 0
      });
      input[i][j] = VERTICAL;
    } else if (char === 'v') {
      carts.push({
        ...c,
        direction: 2, // Down = 2
      });
      input[i][j] = VERTICAL;
    } else if (char === '<') {
      carts.push({
        ...c,
        direction: 3, // Left = 3
      });
      input[i][j] = HORIZONTAL;
    } else if (char === '>') {
      carts.push({
        ...c,
        direction: 1, // Right = 4
      });
      input[i][j] = HORIZONTAL;
    }
  }
}

const sortCarts = () => {
  carts.sort((a, b) => {
    if (a.row < b.row) return -1;
    if (b.row < a.row) return 1;
    return a.col - b.col;
  });
};

const checkForCrash = (cart, ignore) => {
  for (let i = 0; i < carts.length; i++) {
    if (i === ignore) {
      continue;
    }
    if (carts[i].row === cart.row && carts[i].col === cart.col) {
      carts.splice(Math.max(i, ignore), 1);
      carts.splice(Math.min(i, ignore), 1);
      if (!firstCrash) {
        firstCrash = `${cart.col},${cart.row}`;
      }
      return [i, ignore];
    }
  }
  return [];
};

while (carts.length > 1) {
  sortCarts();
  for (let i = 0; i < carts.length; i++) {
    const cart = carts[i];
    const track = input[cart.row][cart.col];
    const upDown = cart.direction % 2 === 0;
    if (track === INTERSECTION) {
      cart.direction += nextDirection[cart.turns % 3];
      cart.direction %= 4;
      cart.turns++;
    } else if ((track === TL_BR && upDown) || (track === TR_BL && !upDown)) {
      // Clockwise
      cart.direction += 1;
      cart.direction %= 4;
    } else if ((track === TL_BR && !upDown) || (track === TR_BL && upDown)) {
      // Anti-clockwise
      cart.direction += 3;
      cart.direction %= 4;
    }
    const m = movements[cart.direction];
    cart.col += m[0];
    cart.row += m[1];
    const removed = checkForCrash(cart, i);
    i -= removed.filter((r) => r <= i).length;
  }
}

console.log('part1:', firstCrash);
console.log(`part2: ${carts[0].col},${carts[0].row}`);
