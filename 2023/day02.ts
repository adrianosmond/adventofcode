import readInput from '../utils/readInput.ts';
import { sum } from '../utils/reducers.ts';

const input = readInput();

const ZERO = {
  red: 0,
  green: 0,
  blue: 0,
};

const games = input
  .replace(/Game/g, '')
  .split('\n')
  .map((game) => {
    const [id, sets] = game.split(': ');

    return {
      id: parseInt(id, 10),
      sets: sets.split('; ').map((colors) => ({
        ...ZERO,
        ...Object.fromEntries(
          colors.split(', ').map((c) => {
            const [count, color] = c.split(' ');
            return [color, parseInt(count, 10)];
          }),
        ),
      })),
    };
  });

export const part1 = () =>
  games
    .filter((game) =>
      game.sets.every(
        (turn) => turn.red <= 12 && turn.green <= 13 && turn.blue <= 14,
      ),
    )
    .map((game) => game.id)
    .reduce(sum);

export const part2 = () =>
  games
    .map((game) => ({
      id: game.id,
      sets: game.sets.reduce(
        (a, b) => ({
          red: Math.max(a.red, b.red),
          green: Math.max(a.green, b.green),
          blue: Math.max(a.blue, b.blue),
        }),
        ZERO,
      ),
    }))
    .map((game) => game.sets.red * game.sets.green * game.sets.blue)
    .reduce(sum);
