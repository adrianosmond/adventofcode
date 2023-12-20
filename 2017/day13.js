import readInput from '../utils/readInput.js';
import { splitAndMapInputLines } from '../utils/functions.js';

const input = readInput();

const firewall = splitAndMapInputLines(input, ': ').reduce(
  (acc, [layer, range]) => ({
    ...acc,
    [layer]: parseInt(range, 10),
  }),
  {},
);

const keys = Object.keys(firewall);
let severity = 0;

keys.forEach((depth) => {
  const range = firewall[depth];
  const present = depth % (range + range - 2) === 0;
  if (present) severity += depth * range;
});

let delay = 0;
while (true) {
  let caught = false;
  for (let i = 0; i < keys.length; i++) {
    const depth = parseInt(keys[i], 10);
    const range = firewall[depth];
    caught = caught || (depth + delay) % (range + range - 2) === 0;
  }
  if (!caught) break;
  delay++;
}

export const part1 = () => severity;

export const part2 = () => delay;
