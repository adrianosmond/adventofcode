import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input24.txt'), 'utf8');
const instructions = input.split('\n');

const xs = instructions
  .filter((_, idx) => idx % 18 === 5)
  .map((instr) => parseInt(instr.replace('add x ', ''), 10));

const ys = instructions
  .filter((_, idx) => idx % 18 === 15)
  .map((instr) => parseInt(instr.replace('add y ', ''), 10));

const zs = instructions
  .filter((_, idx) => idx % 18 === 4)
  .map((instr) => parseInt(instr.replace('div z ', ''), 10));

const MIN = 0;
const MAX = 1;
const ranges = new Array(14).fill(0).map(() => [1, 9]);

const stack = [];
let current = 0;
ys.forEach((y, idx) => {
  const z = zs[idx];
  const x = xs[idx];
  current = { idx, y };
  if (z === 1) {
    stack.push(current);
  } else {
    current = stack.pop();
    current.y += x;
    if (current.y > 0) {
      ranges[current.idx][MAX] = 9 - current.y;
    } else if (current.y < 0) {
      ranges[current.idx][MIN] = 1 - current.y;
    }
    ranges[idx] = ranges[current.idx].map((val) => val + current.y);
  }
});

const maxValues = ranges.map((range) => range[MAX]);
const minValues = ranges.map((range) => range[MIN]);

const arrayToNum = (arr) => parseInt(arr.join(''), 10);

console.log('part1:', arrayToNum(maxValues));

console.log('part2:', arrayToNum(minValues));

/*
I coded the generic solution above retrospectively. I actually solved the problem
by decompiling my input to the following and figuring it out by hand with notes

z = w1 + 4
z = z * 26 + w2 + 11
z = z * 26 + w3 + 5
z = z * 26 + w4 + 11
z = z * 26 + w5 + 14

x = w5 + 4
z = z / 26                // z mod 26 becomes w4 + 11
if (x != w6) {            // w6 must be w5 + 4
  z = z * 26 + w6 + 7
}

z = z * 26 + w7 + 11      // z mod 26 becomes w7 + 11

x = w7 + 2
z = z / 26                // z mod 26 becomes w4 + 11
if (x != w8) {            // w8 must be w7 + 2
  z = z * 26 + w8 + 4
}

x = z % 26 - 3
z = z / 26                // z mod 26 becomes w3 + 5
if (x != w9) {            // w9 must be w4 + 8
  z = z * 26 + w9 + 6
}

z = z * 26 + w10 + 5      // z mod 26 becomes w10 + 5

x = z % 26 - 5
z = z / 26                // z mod 26 becomes w3 + 5
if (x != w11) {           // w11 must be w10
  z = z * 26 + w11 + 9
}

x = z % 26 - 10           // w3 - 5
z = z / 26                // z mod 26 becomes w2 + 11
if (x != w12) {           // w12 must be w3 - 5
  z = z * 26 + w12 + 12
}

x = z % 26 - 4            // w2 + 7
z = z / 26                // z mod 26 becomes w1 + 4
if (x != w13) {           // w13 must be w2 + 7
  z = z * 26 + w13 + 14
}

x = z % 26 - 5            // w1 - 1
z = z / 26
if (x != w14) {           // w14 must be w1 - 1
  z = z * 26 + w14 + 14
}

w1  = 2,3,4,5,6,7,8,9
w2  = 1,2
w3  = 6,7,8,9
w4  = 1
w5  = 1,2,3,4,5
w6  = w5 + 4
w7  = 1,2,3,4,5,6,7
w8  = w7 + 2
w9  = w4 + 8
w10 = 1,2,3,4,5,6,7,8,9
w11 = w10
w12 = w3 - 5
w13 = w2 + 7
w14 = w1 - 1

max = 92915979999498
min = 21611513911181
*/
