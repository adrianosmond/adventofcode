import readInput from '../utils/readInput.ts';
import { multilineStrToIntArrays, strToIntArray } from '../utils/functions.ts';

const input = readInput();
const [seedsStr, ...mapStrs] = input.split(/\n[a-z:-\s]+\n/);
const seeds = strToIntArray(seedsStr.split(': ')[1], ' ');

const maps = mapStrs.map((m) => multilineStrToIntArrays(m));

const reversedMaps = [...maps].reverse();

const getLocationForSeed = (s: number) => {
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

const getSeedForLocation = (l: number) => {
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

export const part1 = () => Math.min(...seeds.map(getLocationForSeed));

export const part2 = () => {
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
