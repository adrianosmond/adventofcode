/* eslint-disable import/prefer-default-export */
import readInput from '../utils/readInput.js';
import { sum } from '../utils/reducers.js';
import { inputToCharGrid } from '../utils/functions.js';

const input = readInput();

const schematics = input.split('\n\n').map((s) => inputToCharGrid(s));
const keys = schematics
  .filter((s) => s[0][0] === '.')
  .map((s) => {
    const schematic = [];
    for (let col = 0; col < s[0].length; col++) {
      for (let row = s.length - 2; row >= 0; row--) {
        if (s[row][col] === '.') {
          schematic.push(s.length - row - 2);
          break;
        }
      }
    }
    return schematic;
  });

const locks = schematics
  .filter((s) => s[0][0] === '#')
  .map((s) => {
    const schematic = [];
    for (let col = 0; col < s[0].length; col++) {
      for (let row = 1; row < s.length; row++) {
        if (s[row][col] === '.') {
          schematic.push(row - 1);
          break;
        }
      }
    }
    return schematic;
  });

const keyFitsLock = (key, lock) => key.every((k, idx) => k + lock[idx] < 6);

export const part1 = () =>
  locks.map((l) => keys.filter((k) => keyFitsLock(k, l)).length).reduce(sum);
