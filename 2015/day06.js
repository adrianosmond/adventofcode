import readInput from '../utils/readInput.js';
import { sum } from '../utils/reducers.js';

const input = readInput();
const instructions = input.split('\n').map((r) => {
  const [, instr, x1, y1, x2, y2] = r.match(
    /(\D+) (\d+),(\d+) through (\d+),(\d+)/,
  );
  return [
    instr,
    parseInt(x1, 10),
    parseInt(y1, 10),
    parseInt(x2, 10),
    parseInt(y2, 10),
  ];
});

export const part1 = () => {
  const lights = new Array(1000).fill(0).map(() => new Array(1000).fill(false));

  instructions.forEach(([instr, x1, y1, x2, y2]) => {
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        if (instr === 'turn on') {
          lights[y][x] = true;
        } else if (instr === 'turn off') {
          lights[y][x] = false;
        } else {
          lights[y][x] = !lights[y][x];
        }
      }
    }
  });

  return lights.reduce((total, row) => total + row.filter(Boolean).length, 0);
};

export const part2 = () => {
  const lights = new Array(1000).fill(0).map(() => new Array(1000).fill(0));

  instructions.forEach(([instr, x1, y1, x2, y2]) => {
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        if (instr === 'turn on') {
          lights[y][x]++;
        } else if (instr === 'turn off') {
          if (lights[y][x] > 0) lights[y][x]--;
        } else {
          lights[y][x] += 2;
        }
      }
    }
  });

  return lights.reduce((total, row) => total + row.reduce(sum), 0);
};
