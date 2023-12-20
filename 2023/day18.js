import readInput from '../utils/readInput.js';
import { splitAndMapInputLines } from '../utils/functions.js';

const input = readInput();
const hexDirectionMap = {
  0: 'R',
  1: 'D',
  2: 'L',
  3: 'U',
};

const directions = splitAndMapInputLines(input);

const getCoordinates = (part2 = false) => {
  let x = 0;
  let y = 0;
  const coords = [[0, 0]];
  directions.forEach(([d, n, hex]) => {
    let dir;
    let dist;

    if (part2) {
      dir = hexDirectionMap[hex.substring(7, 8)];
      dist = parseInt(hex.substring(2, 7), 16);
    } else {
      dir = d;
      dist = parseInt(n, 10);
    }

    switch (dir) {
      case 'U':
        y -= dist;
        break;
      case 'D':
        y += dist;
        break;
      case 'L':
        x -= dist;
        break;
      case 'R':
        x += dist;
        break;
      default:
        throw new Error(`Unexpected direction: ${dir}`);
    }
    coords.push([y, x]);
  });
  return coords;
};

const getArea = (coords) => {
  let area = 0;
  let perimeter = 0;
  let [prevX, prevY] = coords[0];

  for (let i = 1; i < coords.length; i++) {
    const [x, y] = coords[i];
    area += x * prevY - y * prevX;
    perimeter += Math.abs(prevX - x) + Math.abs(prevY - y);
    prevX = x;
    prevY = y;
  }
  return area / 2 + perimeter / 2 + 1;
};

export const part1 = () => getArea(getCoordinates());

export const part2 = () => getArea(getCoordinates(true));

console.log('part1', part1());
console.log('part2', part2());
