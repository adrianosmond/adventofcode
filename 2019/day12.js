import { readInput } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();

const gcd = (a, b) => (!b ? a : gcd(b, a % b));

const lcm = (a, b) => (a * b) / gcd(a, b);

const lcmArray = (numbers) => {
  let multiple = Math.min(...numbers);
  numbers.forEach((n) => {
    multiple = lcm(multiple, n);
  });
  return multiple;
};

const velocities = input.split('\n').map(() => [0, 0, 0]);
const moons = input
  .replace(/[<>=xyz]/g, '')
  .split('\n')
  .map((m) => m.split(', ').map((i) => parseInt(i, 10)));

const history = [];
history.push([...moons].flat());
const frequency = new Array(history.length);

let foundCount = 0;
let steps = 0;

while (foundCount < frequency.length) {
  for (let i = 0; i < moons.length; i++) {
    for (let j = i + 1; j < moons.length; j++) {
      for (let k = 0; k < 3; k++) {
        if (moons[i][k] < moons[j][k]) {
          velocities[i][k]++;
          velocities[j][k]--;
        } else if (moons[i][k] > moons[j][k]) {
          velocities[i][k]--;
          velocities[j][k]++;
        }
      }
    }
  }
  for (let i = 0; i < moons.length; i++) {
    moons[i][0] += velocities[i][0];
    moons[i][1] += velocities[i][1];
    moons[i][2] += velocities[i][2];
  }

  history.push([...moons].flat());
  if (history.length % 2 === 0) {
    for (let i = 0; i < history[0].length; i++) {
      if (frequency[i]) {
        continue;
      }
      const half = history.length / 2;
      let found = true;
      for (let j = 0; j < half; j++) {
        if (history[j][i] !== history[half + j][i]) {
          found = false;
          break;
        }
      }
      if (found) {
        frequency[i] = half;
        foundCount++;
      }
    }
  }

  steps++;

  if (steps === 1000) {
    const energy = moons
      .map((m, idx) => {
        const pot = Math.abs(m[0]) + Math.abs(m[1]) + Math.abs(m[2]);
        const v = velocities[idx];
        const kin = Math.abs(v[0]) + Math.abs(v[1]) + Math.abs(v[2]);
        return pot * kin;
      })
      .reduce(sum);
    console.log('part1:', energy);
  }
}

const uniqueFrequencies = new Set([...frequency]);
console.log('part2:', lcmArray([...uniqueFrequencies]));
