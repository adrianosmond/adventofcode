import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';

const input = readInput();
const digits = input.split('\n').map((s) => strToIntArray(s.trim(), /\s+/));

const isTriangle = (a, b, c) => a + b > c && a + c > b && b + c > a;

const validTriangles = digits.filter((row) => isTriangle(...row));

console.log('part1:', validTriangles.length);

let count = 0;
for (let row = 0; row < digits.length; row += 3) {
  for (let col = 0; col < 3; col++) {
    const a = digits[row][col];
    const b = digits[row + 1][col];
    const c = digits[row + 2][col];
    if (isTriangle(a, b, c)) {
      count++;
    }
  }
}

console.log('part2:', count);
