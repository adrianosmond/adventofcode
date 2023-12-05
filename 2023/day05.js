import { readInput } from '../utils/functions.js';

const input = readInput();

const [seedsStr, ...mapStrs] = input.split(/\n[a-z:-\s]+\n/);
const seeds = seedsStr
  .split(': ')[1]
  .split(' ')
  .map((s) => parseInt(s, 10));

const maps = mapStrs.map((m) =>
  m.split('\n').map((line) => line.split(' ').map((n) => parseInt(n, 10))),
);

const reversedMaps = [...maps].reverse();

const getLocationForSeed = (s) => {
  let val = s;
  maps.forEach((m) => {
    for (const [dest, source, len] of m) {
      if (val >= source && val < source + len) {
        val += dest - source;
        break;
      }
    }
  });
  return val;
};

const getSeedForLocation = (l) => {
  let val = l;
  reversedMaps.forEach((m) => {
    for (const [source, dest, len] of m) {
      if (val >= source && val < source + len) {
        val += dest - source;
        break;
      }
    }
  });
  return val;
};

const part1 = () => Math.min(...seeds.map(getLocationForSeed));

const part2 = () => {
  console.log(
    "This is optimised enough to finish but it's fairly naively brute forcing and might take a few minutes...",
  );
  let location = 0;
  while (true) {
    const seed = getSeedForLocation(location);
    for (let i = 0; i < seeds.length; i += 2) {
      if (seed >= seeds[i] && seed < seeds[i] + seeds[i + 1]) {
        return location;
      }
    }
    location++;
  }
};

console.log('part1', part1());
console.log('part2', part2());
