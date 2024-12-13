import readInput from '../utils/readInput.js';
import { sum } from '../utils/reducers.js';

const input = readInput();

const machines = input.split('\n\n').map((m) => {
  const [, ax, ay] = m
    .match(/Button A: X\+(\d+), Y\+(\d+)/)
    .map((n) => parseInt(n, 10));
  const [, bx, by] = m
    .match(/Button B: X\+(\d+), Y\+(\d+)/)
    .map((n) => parseInt(n, 10));
  const [, px, py] = m
    .match(/Prize: X=(\d+), Y=(\d+)/)
    .map((n) => parseInt(n, 10));

  return {
    a: [ax, ay],
    b: [bx, by],
    prize: [px, py],
  };
});

const findButtonPushes = (prize, a, b) => {
  const numAPushes =
    (prize[0] * b[1] - prize[1] * b[0]) / (a[0] * b[1] - a[1] * b[0]);
  const numBPushes =
    (a[0] * prize[1] - a[1] * prize[0]) / (a[0] * b[1] - a[1] * b[0]);

  if (
    Math.floor(numAPushes) === numAPushes &&
    Math.floor(numBPushes) === numBPushes
  ) {
    return [numAPushes, numBPushes];
  }
  return [0, 0];
};

export const part1 = () =>
  machines
    .map(({ prize, a, b }) => findButtonPushes(prize, a, b))
    .map(([numAPushes, numBPushes]) => 3 * numAPushes + numBPushes)
    .reduce(sum);

export const part2 = () =>
  machines
    .map((m) => ({
      ...m,
      prize: [m.prize[0] + 10000000000000, m.prize[1] + 10000000000000],
    }))
    .map(({ prize, a, b }) => findButtonPushes(prize, a, b))
    .map(([numAPushes, numBPushes]) => 3 * numAPushes + numBPushes)
    .reduce(sum);
