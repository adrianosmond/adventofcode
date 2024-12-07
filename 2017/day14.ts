import readInput from '../utils/readInput.ts';
import { inputToCharGrid, strToIntArray } from '../utils/functions.ts';
import knotHash from './knotHash.ts';
import { sum } from '../utils/reducers.ts';

const input = readInput();

let outputStr = '';

for (let i = 0; i < 128; i++) {
  const str = `${input}-${i}`;
  const hash = knotHash(str);
  for (let j = 0; j < 32; j++) {
    let bin = parseInt(hash[j], 16).toString(2);
    while (bin.length < 4) {
      bin = `0${bin}`;
    }
    outputStr += bin;
  }
  outputStr += '\n';
}

const output = inputToCharGrid(outputStr);

function getNeighbours(row: number, col: number) {
  const n = [];
  if (row > 0 && output[row - 1][col] === '1') {
    n.push(`${row - 1},${col}`);
  }
  if (row < 127 && output[row + 1][col] === '1') {
    n.push(`${row + 1},${col}`);
  }
  if (col > 0 && output[row][col - 1] === '1') {
    n.push(`${row},${col - 1}`);
  }
  if (col < 127 && output[row][col + 1] === '1') {
    n.push(`${row},${col + 1}`);
  }
  return n;
}

export const part1 = () =>
  outputStr
    .replace(/0/g, '')
    .split('\n')
    .map((r) => r.length)
    .reduce(sum);

export const part2 = () => {
  let groups = 0;
  for (let row = 0; row < 128; row++) {
    for (let col = 0; col < 128; col++) {
      if (output[row][col] !== '1') continue;
      const queue = [`${row},${col}`];

      while (queue.length > 0) {
        const current = queue.shift()!;
        const [r, c] = strToIntArray(current, ',');
        const neighbours = getNeighbours(r, c);
        output[r][c] = '-';
        for (let n = 0; n < neighbours.length; n++) {
          if (queue.includes(neighbours[n])) continue;
          queue.push(neighbours[n]);
        }
      }
      groups++;
    }
  }
  return groups;
};
