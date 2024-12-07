import readInput from '../utils/readInput.ts';
import { splitAndMapInputLines } from '../utils/functions.ts';

const input = readInput();

const firewall: Record<string, number> = splitAndMapInputLines(
  input,
  ': ',
).reduce<Record<string, number>>(
  (acc, [layer, range]) => ({
    ...acc,
    [layer]: parseInt(range, 10),
  }),
  {},
);

const keys = Object.keys(firewall);
let severity = 0;

keys.forEach((depth: string) => {
  const range = firewall[depth];
  const depthNum = parseInt(depth, 10);
  const present = depthNum % (range + range - 2) === 0;
  if (present) severity += depthNum * range;
});

let delay = 0;
while (true) {
  let caught = false;
  for (let i = 0; i < keys.length; i++) {
    const depth = parseInt(keys[i], 10);
    const range = firewall[keys[i]];
    caught = caught || (depth + delay) % (range + range - 2) === 0;
  }
  if (!caught) break;
  delay++;
}

export const part1 = () => severity;

export const part2 = () => delay;
