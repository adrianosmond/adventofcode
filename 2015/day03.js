import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input03.txt'), 'utf8');
const directions = input.split('');

const makeKey = (x, y) => `${x},${y}`;

const traceRoute = (numSantas) => {
  const x = new Array(numSantas).fill(0);
  const y = new Array(numSantas).fill(0);
  const visits = {
    '0,0': 1,
  };

  directions.forEach((dir, idx) => {
    switch (dir) {
      case '^': {
        y[idx % numSantas]--;
        break;
      }
      case 'v': {
        y[idx % numSantas]++;
        break;
      }
      case '<': {
        x[idx % numSantas]--;
        break;
      }
      case '>': {
        x[idx % numSantas]++;
        break;
      }
      default:
        throw new Error(`Unexpected direction found: ${dir}`);
    }
    const key = makeKey(x[idx % numSantas], y[idx % numSantas]);
    if (!visits[key]) {
      visits[key] = 0;
    }
    visits[key]++;
  });

  return Object.keys(visits).length;
};

const part1 = () => traceRoute(1);

const part2 = () => traceRoute(2);

console.log('part1', part1());
console.log('part2', part2());
