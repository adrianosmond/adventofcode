import { readInput } from '../utils/functions.js';

const input = readInput();
const movements = input
  .split('\n')
  .map((i) => i.split(' '))
  .map(([direction, amount]) => [direction, parseInt(amount, 10)]);

const X = 1;
const Y = 0;
const DIRECTIONS = {
  U: [-1, 0],
  D: [1, 0],
  L: [0, -1],
  R: [0, 1],
};

const simulateMovement = (numKnots, startY = 0, startX = 0) => {
  const knots = new Array(numKnots).fill(0).map(() => [startY, startX]);
  const visited = new Set([[startY, startX].join(',')]);
  const headKnot = knots[0];
  const tailKnot = knots[numKnots - 1];

  movements.forEach(([direction, amount]) => {
    for (let i = 0; i < amount; i++) {
      headKnot[Y] += DIRECTIONS[direction][Y];
      headKnot[X] += DIRECTIONS[direction][X];

      for (let knot = 1; knot < numKnots; knot++) {
        const prevKnot = knots[knot - 1];
        const currentKnot = knots[knot];
        const yDiff = Math.abs(prevKnot[Y] - currentKnot[Y]);
        const xDiff = Math.abs(prevKnot[X] - currentKnot[X]);
        const manhattanDistance = xDiff + yDiff;
        if (manhattanDistance === 1) continue;
        if (yDiff === 2) {
          if (manhattanDistance === 3) currentKnot[X] = prevKnot[X];
          if (prevKnot[Y] < currentKnot[Y]) currentKnot[Y]--;
          else currentKnot[Y]++;
        }
        if (xDiff === 2) {
          if (manhattanDistance === 3) currentKnot[Y] = prevKnot[Y];
          if (prevKnot[X] < currentKnot[X]) currentKnot[X]--;
          else currentKnot[X]++;
        }
      }

      visited.add(tailKnot.join(','));
    }
  });
  return visited.size;
};

const part1 = () => simulateMovement(2);

const part2 = () => simulateMovement(10);

console.log('part1', part1());
console.log('part2', part2());
