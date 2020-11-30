const input = require('./input10'); // Array of array of integers

const positions = input.map((x) => [x[0], x[1]]);
const velocities = input.map((x) => [x[2], x[3]]);

let loops = 1;
let bestTime = 0;

function hasNegativePositions() {
  return positions.some((p) => p[0] < 0 || p[1] < 0);
}

let lowestArea = Number.MAX_VALUE;
let message = [];

while (loops < 11000) {
  for (let j = 0; j < positions.length; j++) {
    positions[j][0] += velocities[j][0];
    positions[j][1] += velocities[j][1];
  }
  if (!hasNegativePositions()) {
    const xMin = Math.min(...positions.map((x) => x[0]));
    const yMin = Math.min(...positions.map((x) => x[1]));
    const xMax = Math.max(...positions.map((x) => x[0]));
    const yMax = Math.max(...positions.map((x) => x[1]));

    const area = (yMax - yMin) * (xMax - xMin);
    if (area < lowestArea) {
      bestTime = loops;
      lowestArea = area;
      message = [];
      for (let i = 0; i <= yMax - yMin; i++) {
        message[i] = Array(xMax - xMin + 1).fill(' ');
      }
      for (let i = 0; i < positions.length; i++) {
        const p = positions[i];
        message[p[1] - yMin][p[0] - xMin] = '#';
      }
    }
  }
  loops++;
}

console.log('part1:');
console.log(message.map((r) => r.join('')).join('\n'));
console.log('part2:', bestTime);
