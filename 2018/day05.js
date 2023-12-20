import readInput from '../utils/readInput.js';

const input = readInput();

const match = (c1, c2) => c1 !== c2 && c1.toLowerCase() === c2.toLowerCase();

export const part1 = (polymer = input) => {
  const polyArr = polymer.split('');
  let lPtr = 0;
  let rPtr = 1;
  while (rPtr < polymer.length) {
    if (match(polymer[lPtr], polymer[rPtr])) {
      polyArr[lPtr] = '#';
      polyArr[rPtr] = '#';
      lPtr--;
      while (lPtr >= 0) {
        if (polyArr[lPtr] !== '#') {
          break;
        }
        lPtr--;
      }
      rPtr++;
    } else {
      lPtr++;
      while (lPtr < rPtr) {
        if (polyArr[lPtr] !== '#') {
          break;
        }
        lPtr++;
      }
      rPtr++;
    }

    if (lPtr < 0) {
      lPtr = rPtr;
      rPtr++;
    }
  }
  return polyArr.filter((x) => x !== '#').length;
};

export const part2 = () => {
  const chars = new Array(26).fill().map((_, i) => String.fromCharCode(65 + i));
  return Math.min(
    ...chars.map((c) => part1(input.replace(new RegExp(c, 'gi'), ''))),
  );
};
