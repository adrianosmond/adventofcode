const input = require('./input10'); // Multi line string

const space = input.split('\n').map(r => r.split(''));
const asteroids = [];

const blocksLOS = (from, to, blocker) => {
  const xDiff = to.x - from.x;
  const yDiff = to.y - from.y;
  const blockerXDiff = blocker.x - from.x;
  const blockerYDiff = blocker.y - from.y;

  if (xDiff < 0 && blockerXDiff >= 0) {
    return false;
  }
  if (xDiff < 0 && blockerXDiff < xDiff) {
    return false;
  }
  if (xDiff > 0 && blockerXDiff <= 0) {
    return false;
  }
  if (xDiff > 0 && blockerXDiff > xDiff) {
    return false;
  }
  if (yDiff < 0 && blockerYDiff >= 0) {
    return false;
  }
  if (yDiff < 0 && blockerYDiff < yDiff) {
    return false;
  }
  if (yDiff > 0 && blockerYDiff <= 0) {
    return false;
  }
  if (yDiff > 0 && blockerYDiff > yDiff) {
    return false;
  }
  if (
    xDiff === 0 &&
    blockerXDiff === 0 &&
    Math.abs(yDiff) > Math.abs(blockerYDiff)
  ) {
    return true;
  }
  if (
    yDiff === 0 &&
    blockerYDiff === 0 &&
    Math.abs(xDiff) > Math.abs(blockerXDiff)
  ) {
    return true;
  }
  const xRatio = Math.abs(xDiff) / Math.abs(blockerXDiff);
  const yRatio = Math.abs(yDiff) / Math.abs(blockerYDiff);
  if (xRatio === yRatio) {
    return true;
  }
  return false;
};

const getAngle = (from, to) => {
  let angle = Math.atan2(to.y - from.y, to.x - from.x) + Math.PI / 2;
  if (angle < 0) angle += 2 * Math.PI;
  return angle;
};

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

const findBestAsteroid = () => {
  for (let i = 0; i < asteroids.length; i++) {
    const from = asteroids[i];
    for (let j = 0; j < asteroids.length; j++) {
      if (i === j) {
        continue;
      }
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
      }
    }
  }

  return asteroids.reduce(
    (best, current) =>
      current.lineOfSight > best.lineOfSight ? current : best,
    { lineOfSight: -1 },
  );
};

const bestAsteroid = findBestAsteroid();

const day10part2 = () => {
  const toDestroy = asteroids.filter(a => a !== bestAsteroid);
  let destroyed = 0;
  let lastAngle = -1;

  for (let i = 0; i < toDestroy.length; i++) {
    toDestroy[i].angle = getAngle(bestAsteroid, toDestroy[i]);
  }

  const distance = (a, b) => {
    const xDiff = Math.abs(a.x - b.x);
    const yDiff = Math.abs(a.y - b.y);
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  };

  toDestroy.sort((a, b) => {
    if (a.angle === b.angle) {
      return distance(a, bestAsteroid) - distance(b, bestAsteroid);
    }
    return a.angle - b.angle;
  });

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

console.log('part1:', bestAsteroid.lineOfSight);
console.log('part2:', day10part2());
