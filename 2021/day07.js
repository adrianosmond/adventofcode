const fs = require('fs');
const path = require('path');
const { strToIntArray } = require('../utils/functions');

const input = fs.readFileSync(path.resolve(__dirname, 'input07.txt'), 'utf8');

const positions = strToIntArray(input, ',');
const min = Math.min(...positions);
const max = Math.max(...positions);

const part1 = () => {
  let bestCost = Number.MAX_SAFE_INTEGER;

  for (let i = min; i <= max; i++) {
    let cost = 0;
    positions.forEach((pos) => {
      cost += Math.abs(pos - i);
    });

    if (cost < bestCost) bestCost = cost;
  }

  return bestCost;
};

const part2 = () => {
  let bestCost = Number.MAX_SAFE_INTEGER;

  for (let i = min; i <= max; i++) {
    let cost = 0;
    positions.forEach((pos) => {
      const diff = Math.abs(pos - i);
      cost += (diff * (diff + 1)) / 2;
    });

    if (cost < bestCost) bestCost = cost;
  }

  return bestCost;
};

console.log('part1', part1());
console.log('part2', part2());
