const fs = require('fs');
const path = require('path');

const input = fs
  .readFileSync(path.resolve(__dirname, 'input13.txt'), 'utf8')
  .split('\n')
  .map(x => x.split(''));

const VERTICAL = '|';
const HORIZONTAL = '-';
const INTERSECTION = '+';
const CURVE_TOP_LEFT = '/';
const CURVE_TOP_RIGHT = '\\';

const nextTurn = {
  right: 'left',
  left: 'straight',
  straight: 'right',
};

const newDirection = {
  up: {
    left: 'left',
    right: 'right',
  },
  down: {
    left: 'right',
    right: 'left',
  },
  left: {
    left: 'down',
    right: 'up',
  },
  right: {
    left: 'up',
    right: 'down',
  },
};

const carts = [];
let firstCrash;

for (let i = 0; i < input.length; i++) {
  const row = input[i];
  for (let j = 0; j < row.length; j++) {
    const char = input[i][j];
    if (char === '^') {
      carts.push({
        direction: 'up',
        row: i,
        col: j,
        lastTurn: 'right',
      });
      input[i][j] = VERTICAL;
    } else if (char === 'v') {
      carts.push({
        direction: 'down',
        row: i,
        col: j,
        lastTurn: 'right',
      });
      input[i][j] = VERTICAL;
    } else if (char === '<') {
      carts.push({
        direction: 'left',
        row: i,
        col: j,
        lastTurn: 'right',
      });
      input[i][j] = HORIZONTAL;
    } else if (char === '>') {
      carts.push({
        direction: 'right',
        row: i,
        col: j,
        lastTurn: 'right',
      });
      input[i][j] = HORIZONTAL;
    }
  }
}

function sortCarts() {
  carts.sort((a, b) => {
    if (a.row < b.row) return -1;
    if (b.row < a.row) return 1;
    return a.col - b.col;
  });
}

function checkForCrash(cart, ignore) {
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
}

while (carts.length > 1) {
  sortCarts();
  for (let i = 0; i < carts.length; i++) {
    const cart = carts[i];
    const trackType = input[cart.row][cart.col];
    if (trackType === INTERSECTION) {
      const turn = nextTurn[cart.lastTurn];
      if (turn !== 'straight') {
        cart.direction = newDirection[cart.direction][turn];
      }
      cart.lastTurn = turn;
    } else if (trackType === CURVE_TOP_LEFT) {
      if (cart.direction === 'up') {
        cart.direction = 'right';
      } else if (cart.direction === 'down') {
        cart.direction = 'left';
      } else if (cart.direction === 'left') {
        cart.direction = 'down';
      } else if (cart.direction === 'right') {
        cart.direction = 'up';
      }
    } else if (trackType === CURVE_TOP_RIGHT) {
      if (cart.direction === 'up') {
        cart.direction = 'left';
      } else if (cart.direction === 'down') {
        cart.direction = 'right';
      } else if (cart.direction === 'left') {
        cart.direction = 'up';
      } else if (cart.direction === 'right') {
        cart.direction = 'down';
      }
    }
    if (cart.direction === 'up') {
      cart.row--;
    } else if (cart.direction === 'down') {
      cart.row++;
    } else if (cart.direction === 'left') {
      cart.col--;
    } else if (cart.direction === 'right') {
      cart.col++;
    }
    const removed = checkForCrash(cart, i);
    i -= removed.filter(r => r <= i).length;
  }
}

console.log('part1:', firstCrash);
console.log(`part2: ${carts[0].col},${carts[0].row}`);
