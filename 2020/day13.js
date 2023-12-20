import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';

const input = readInput();

export const part1 = () => {
  const [now, ...buses] = strToIntArray(
    input.replace(/,x/g, '').replace(/,/g, '\n'),
  );

  let time = now;
  let departing = buses.find((bus) => time % bus === 0);
  while (!departing) {
    time++;
    departing = buses.find((bus) => time % bus === 0);
  }
  return (time - now) * departing;
};

export const part2 = () => {
  const [firstBus, ...buses] = input
    .split('\n')[1]
    .split(',')
    .map((n, i) => [parseInt(n, 10), i])
    .filter(([n]) => !Number.isNaN(n));

  let multiplier = firstBus[0];
  let i = 0;

  buses.forEach(([bus, busIndex]) => {
    while (true) {
      if ((i + busIndex) % bus === 0) {
        multiplier *= bus;
        break;
      }
      i += multiplier;
    }
  });

  return i;
};
