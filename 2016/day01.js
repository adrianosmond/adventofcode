const input = require('./input01');
const { manhattan } = require('../utils/functions');

const directions = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const instructions = input.split(', ').map(i => {
  const direction = i[0] === 'R' ? 1 : 3;
  const distance = parseInt(i.substr(1), 10);
  return { direction, distance };
});

let facing = 0;
const pos = [0, 0];
const visited = { '0,0': true };
let visitedTwiceDistance = -1;

instructions.forEach(({ direction, distance }) => {
  facing = (facing + direction) % 4;
  for (let i = 0; i < distance; i++) {
    pos[0] += directions[facing][0];
    pos[1] += directions[facing][1];
    const key = `${pos[0]},${pos[1]}`;
    if (visitedTwiceDistance < 0 && visited[key]) {
      visitedTwiceDistance = manhattan([0, 0], pos);
    }
    visited[key] = true;
  }
});

console.log('part1:', manhattan([0, 0], pos));
console.log('part2:', visitedTwiceDistance);
