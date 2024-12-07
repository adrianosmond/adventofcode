import readInput from '../utils/readInput.ts';

const input = readInput();

const generators = input
  .split('\n')
  .map((s) => s.substring(24))
  .map((d) => parseInt(d, 10));

const aFactor = 16807;
const bFactor = 48271;
const remainder = 2147483647;

export const part1 = () => {
  let [a, b] = generators;
  let aBits;
  let bBits;
  let matches = 0;

  for (let i = 0; i < 40000000; i++) {
    a = (a * aFactor) % remainder;
    b = (b * bFactor) % remainder;
    aBits = a & 65535;
    bBits = b & 65535;
    if (aBits === bBits) {
      matches++;
    }
  }
  return matches;
};

export const part2 = () => {
  let [a, b] = generators;
  let matches = 0;
  let aBits;
  let bBits;
  for (let i = 0; i < 5000000; i++) {
    a = (a * aFactor) % remainder;
    while ((a & 3) > 0) {
      a = (a * aFactor) % remainder;
    }
    b = (b * bFactor) % remainder;
    while ((b & 7) > 0) {
      b = (b * bFactor) % remainder;
    }

    aBits = a & 65535;
    bBits = b & 65535;
    if (aBits === bBits) {
      matches++;
    }
  }
  return matches;
};
