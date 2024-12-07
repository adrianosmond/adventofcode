import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';

const input = readInput();

type Cucumber = { loc: string };
const cucumbers: Record<string, boolean> = {};
const cucumbersS: Cucumber[] = [];
const cucumbersE: Cucumber[] = [];

let maxY = 0;
let maxX = 0;

input.split('\n').forEach((r, y) => {
  r.split('').forEach((c, x) => {
    if (c !== '.') cucumbers[`${x},${y}`] = true;
    if (c === 'v') cucumbersS.push({ loc: `${x},${y}` });
    if (c === '>') cucumbersE.push({ loc: `${x},${y}` });
    maxX = Math.max(maxX, x);
  });
  maxY = Math.max(maxY, y);
});

const getEast = (key: string) => {
  const [x, y] = strToIntArray(key, ',');
  if (x + 1 > maxX) return `0,${y}`;
  return `${x + 1},${y}`;
};

const getSouth = (key: string) => {
  const [x, y] = strToIntArray(key, ',');
  if (y + 1 > maxY) return `${x},0`;
  return `${x},${y + 1}`;
};

const east: Record<string, string> = {};
const south: Record<string, string> = {};

for (let y = 0; y <= maxY; y++) {
  for (let x = 0; x <= maxX; x++) {
    const key = `${x},${y}`;
    east[key] = getEast(key);
    south[key] = getSouth(key);
  }
}

export const part1 = () => {
  let changed = true;
  let steps = 0;
  while (changed) {
    steps++;
    changed = false;
    cucumbersE
      .filter((cucumber) => {
        const target = east[cucumber.loc];
        if (cucumbers[target]) return false;
        return true;
      })
      .forEach((cucumber) => {
        changed = true;
        const target = east[cucumber.loc];
        cucumbers[cucumber.loc] = false;
        cucumbers[target] = true;
        cucumber.loc = target;
      });

    cucumbersS
      .filter((cucumber) => {
        const target = south[cucumber.loc];
        if (cucumbers[target]) return false;
        return true;
      })
      .forEach((cucumber) => {
        changed = true;
        const target = south[cucumber.loc];
        cucumbers[cucumber.loc] = false;
        cucumbers[target] = true;
        cucumber.loc = target;
      });
  }
  return steps;
};
