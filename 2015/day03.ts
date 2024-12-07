import readInput from '../utils/readInput.ts';

const input = readInput();
const directions = input.split('');

const makeKey = (x: number, y: number) => `${x},${y}`;

const traceRoute = (numSantas: number) => {
  const x = new Array(numSantas).fill(0);
  const y = new Array(numSantas).fill(0);
  const visits: Record<string, number> = {
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

export const part1 = () => traceRoute(1);

export const part2 = () => traceRoute(2);
