import readInput from '../utils/readInput.js';
import { getNeighbours, inputToIntGrid } from '../utils/functions.js';

const input = readInput();
const grid = inputToIntGrid(input);

const findLeastHeatLoss = (minMovement, maxMovement) => {
  const queue = [[0, 0, 0, 0, 0]];
  const bestHeatLosses = new Array(grid.length)
    .fill(0)
    .map(() =>
      new Array(grid[0].length)
        .fill(0)
        .map(() =>
          new Array(4)
            .fill(0)
            .map(() =>
              new Array(maxMovement + 1).fill(Number.MAX_SAFE_INTEGER),
            ),
        ),
    );

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < maxMovement + 1; j++) {
      bestHeatLosses[0][0][i][j] = 0;
    }
  }

  while (queue.length > 0) {
    const [
      row,
      col,
      prevDirection,
      distanceInPrevDirection,
      currentTotalHeatLoss,
    ] = queue.shift();

    getNeighbours(grid, row, col, true).forEach((n, direction) => {
      // Ignore directions where we'd go off the grid
      if (n === null) return;
      // Don't allow travelling further in the direction than we're allowed
      if (
        direction === prevDirection &&
        distanceInPrevDirection === maxMovement
      )
        return;
      // Don't allow changing direction if we haven't travelled the minimum distance yet
      if (
        direction !== prevDirection &&
        distanceInPrevDirection < minMovement &&
        distanceInPrevDirection !== 0
      )
        return;

      // Don't allow turning back on ourselves
      if (
        (prevDirection === 0 && direction === 1) ||
        (prevDirection === 1 && direction === 0) ||
        (prevDirection === 2 && direction === 3) ||
        (prevDirection === 3 && direction === 2)
      )
        return;

      const [r, c, heatLoss] = n;
      const newDistanceInDirection =
        direction === prevDirection ? distanceInPrevDirection + 1 : 1;

      if (
        currentTotalHeatLoss + heatLoss <
        bestHeatLosses[r][c][direction][newDistanceInDirection]
      ) {
        queue.push([
          r,
          c,
          direction,
          newDistanceInDirection,
          currentTotalHeatLoss + heatLoss,
        ]);

        bestHeatLosses[r][c][direction][newDistanceInDirection] =
          currentTotalHeatLoss + heatLoss;
      }
    });
  }

  return Math.min(
    ...bestHeatLosses[grid.length - 1][grid[0].length - 1]
      // if we have a minMovement, throw away solutions which reached the end with fewer
      // steps in the direction of travel than the minMovement
      .map((d) => (minMovement > 0 ? d.slice(minMovement) : d))
      .flat(),
  );
};

const part1 = () => findLeastHeatLoss(0, 3);

const part2 = () => findLeastHeatLoss(4, 10);

console.log('part1', part1());
console.log('part2', part2());
