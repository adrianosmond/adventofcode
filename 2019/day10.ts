import readInput from '../utils/readInput.ts';
import { inputToCharGrid } from '../utils/functions.ts';
import { highestByKey } from '../utils/reducers.ts';

const input = readInput();

const space = inputToCharGrid(input);

type Asteroid = {
  x: number;
  y: number;
  lineOfSight: number;
  angle: number;
  destroyed: boolean;
};

const distance = (a: Asteroid, b: Asteroid) => {
  const xDiff = Math.abs(a.x - b.x);
  const yDiff = Math.abs(a.y - b.y);
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
};

const blocksLOS = (from: Asteroid, to: Asteroid, blocker: Asteroid) => {
  const xDiff = to.x - from.x;
  const yDiff = to.y - from.y;
  const blockerXDiff = blocker.x - from.x;
  const blockerYDiff = blocker.y - from.y;

  // Can't block if it's in a different direction
  if (
    (xDiff < 0 && blockerXDiff >= 0) ||
    (xDiff > 0 && blockerXDiff <= 0) ||
    (yDiff < 0 && blockerYDiff >= 0) ||
    (yDiff > 0 && blockerYDiff <= 0)
  ) {
    return false;
  }

  // Can't block if it's further
  if (distance(from, to) < distance(from, blocker)) {
    return false;
  }

  // It's closer, so if it's on the same x or y, it's a blocker
  if (
    (xDiff === 0 && blockerXDiff === 0) ||
    (yDiff === 0 && blockerYDiff === 0)
  ) {
    return true;
  }

  // It's closer, and in the same(ish) direction,
  // so if it's ratio for x and y diff are the same, it's a blocker
  const xRatio = Math.abs(xDiff) / Math.abs(blockerXDiff);
  const yRatio = Math.abs(yDiff) / Math.abs(blockerYDiff);
  if (xRatio === yRatio) {
    return true;
  }

  // Didn't find any reason for it to block LOS, so it's not a blocker
  return false;
};

const getAngle = (from: Asteroid, to: Asteroid) => {
  let angle = Math.atan2(to.y - from.y, to.x - from.x) + Math.PI / 2;
  if (angle < 0) angle += 2 * Math.PI;
  return angle;
};

const setupAsteroids = () => {
  const asteroids = [];
  for (let y = 0; y < space.length; y++) {
    for (let x = 0; x < space[y].length; x++) {
      if (space[y][x] === '#') {
        asteroids.push({
          x,
          y,
          lineOfSight: 0,
          angle: 0,
          destroyed: false,
        });
      }
    }
  }
  return asteroids;
};

const findBestAsteroid = (asteroids: Asteroid[]) => {
  for (let i = 0; i < asteroids.length; i++) {
    const from = asteroids[i];
    for (let j = i + 1; j < asteroids.length; j++) {
      const to = asteroids[j];
      let isBlocked = false;
      for (let k = 0; k < asteroids.length && !isBlocked; k++) {
        if (k === i || k === j) {
          continue;
        }
        const blocker = asteroids[k];

        if (blocksLOS(from, to, blocker)) {
          isBlocked = true;
        }
      }
      if (!isBlocked) {
        from.lineOfSight++;
        to.lineOfSight++;
      }
    }
  }

  return asteroids.reduce(highestByKey('lineOfSight'), {
    lineOfSight: -1,
  } as Asteroid);
};

const sortAsteroidsToDestroy = (
  asteroids: Asteroid[],
  monitoringStation: Asteroid,
) => {
  const toDestroy = asteroids.filter((a) => a !== monitoringStation);
  for (let i = 0; i < toDestroy.length; i++) {
    toDestroy[i].angle = getAngle(monitoringStation, toDestroy[i]);
  }

  toDestroy.sort((a, b) => {
    if (a.angle === b.angle) {
      return distance(a, monitoringStation) - distance(b, monitoringStation);
    }
    return a.angle - b.angle;
  });
  return toDestroy;
};

const destroyAsteroids = (
  asteroids: Asteroid[],
  monitoringStation: Asteroid,
) => {
  let destroyed = 0;
  let lastAngle = -1;

  const toDestroy = sortAsteroidsToDestroy(asteroids, monitoringStation);

  while (destroyed < toDestroy.length) {
    for (let i = 0; i < toDestroy.length; i++) {
      const candidate = toDestroy[i];
      if (!candidate.destroyed && candidate.angle !== lastAngle) {
        candidate.destroyed = true;
        lastAngle = candidate.angle;
        destroyed++;
        if (destroyed === 200) {
          return candidate.x * 100 + candidate.y;
        }
      }
    }
    lastAngle = -1;
  }
  throw new Error('Something went wrong');
};

const asteroids = setupAsteroids();
const bestAsteroid = findBestAsteroid(asteroids);

export const part1 = () => bestAsteroid.lineOfSight;

export const part2 = () => destroyAsteroids(asteroids, bestAsteroid);
