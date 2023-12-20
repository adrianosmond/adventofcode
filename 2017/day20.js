import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';
import { lowestWithIndex } from '../utils/reducers.js';

const input = readInput();

const getParticles = () =>
  input.split('\n').map((l) => strToIntArray(l.replace(/[^,\-0-9]/g, ''), ','));

const x = 0;
const y = 1;
const z = 2;
const vx = 3;
const vy = 4;
const vz = 5;
const ax = 6;
const ay = 7;
const az = 8;

const manhattan = (xDiff, yDiff, zDiff) =>
  Math.abs(xDiff) + Math.abs(yDiff) + Math.abs(zDiff);

const updateParticles = (particles) => {
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    particle[vx] += particle[ax];
    particle[vy] += particle[ay];
    particle[vz] += particle[az];

    particle[x] += particle[vx];
    particle[y] += particle[vy];
    particle[z] += particle[vz];
  }
};

export const part1 = () => {
  let prevBestIdx = -1;
  let timesInARow = 0;
  const particles = getParticles();

  while (timesInARow < 10000) {
    updateParticles(particles);
    const manhattans = particles.map((p) => manhattan(p[x], p[y], p[z]));
    const { index } = manhattans.reduce(lowestWithIndex, {
      index: -1,
      best: Number.MAX_SAFE_INTEGER,
    });
    if (index === prevBestIdx) {
      timesInARow++;
    } else {
      timesInARow = 0;
      prevBestIdx = index;
    }
  }
  return prevBestIdx;
};

export const part2 = () => {
  let particles = getParticles();
  let prevCount = particles.length;
  let timesInARow = 0;

  while (timesInARow < 10000) {
    updateParticles(particles);

    particles = particles.filter(
      (p, _, ps) =>
        ps.filter((p2) => p[x] === p2[x] && p[y] === p2[y] && p[z] === p2[z])
          .length === 1,
    );

    const count = particles.length;
    if (count === prevCount) {
      timesInARow++;
    } else {
      timesInARow = 0;
      prevCount = count;
    }
  }
  return prevCount;
};
