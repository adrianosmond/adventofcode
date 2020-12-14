const fs = require('fs');
const path = require('path');
const { manhattan } = require('../utils/functions');

const input = fs.readFileSync(path.resolve(__dirname, 'input12.txt'), 'utf8');

const instructions = input
  .split('\n')
  .map((i) => i.match(/([NESWFLR])(\d+)/))
  .map(([, i, a]) => [i, parseInt(a, 10)]);

const move = () => {
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  let dIdx = 0;
  let x = 0;
  let y = 0;

  instructions.forEach(([instruction, amount]) => {
    switch (instruction) {
      case 'N':
        y -= amount;
        break;
      case 'S':
        y += amount;
        break;
      case 'E':
        x += amount;
        break;
      case 'W':
        x -= amount;
        break;
      case 'L':
        dIdx += 4 - amount / 90;
        dIdx %= 4;
        break;
      case 'R':
        dIdx += amount / 90;
        dIdx %= 4;
        break;
      case 'F':
        y += directions[dIdx][0] * amount;
        x += directions[dIdx][1] * amount;
        break;
      default:
        break;
    }
  });

  return manhattan([x, y]);
};

const moveWaypoint = () => {
  let x = 0;
  let y = 0;
  let wX = 10;
  let wY = -1;

  instructions.forEach(([instruction, amount]) => {
    switch (instruction) {
      case 'N':
        wY -= amount;
        break;
      case 'S':
        wY += amount;
        break;
      case 'E':
        wX += amount;
        break;
      case 'W':
        wX -= amount;
        break;
      case 'L':
      case 'R':
        {
          const tmp = wX;
          const leftRotation = instruction === 'L' ? amount : 360 - amount;
          if (leftRotation === 180) {
            wX = -wX;
            wY = -wY;
          } else if (leftRotation === 90) {
            wX = wY;
            wY = -tmp;
          } else if (leftRotation === 270) {
            wX = -wY;
            wY = tmp;
          }
        }
        break;
      case 'F':
        y += wY * amount;
        x += wX * amount;
        break;
      default:
        break;
    }
  });

  return manhattan([x, y]);
};

const part1 = () => move();

const part2 = () => moveWaypoint();

console.log('part1', part1());
console.log('part2', part2());
