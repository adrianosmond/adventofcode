import { readInput, splitAndMapInputLines } from '../utils/functions.js';

const input = readInput();
const instructions = splitAndMapInputLines(input);

const regKeys = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
};
const regKeysArray = Object.keys(regKeys);
const isKey = (x) => regKeysArray.includes(x);
const sanitize = (x) => (isKey(x) ? x : parseInt(x, 10));
let instruction = 0;
let multiplied = 0;

const registers = Array(regKeysArray.length).fill(0);
const getVal = (x) => (isKey(x) ? registers[regKeys[x]] : parseInt(x, 10));

const commands = {
  set: (X, Y) => {
    registers[regKeys[X]] = Y;
  },
  sub: (X, Y) => {
    registers[regKeys[X]] -= Y;
  },
  mul: (X, Y) => {
    multiplied++;
    registers[regKeys[X]] *= Y;
  },
  jnz: (X, Y) => {
    if (typeof X === 'number') {
      instruction += X !== 0 ? Y - 1 : 0;
    } else {
      instruction += registers[regKeys[X]] !== 0 ? Y - 1 : 0;
    }
  },
};

while (instruction >= 0 && instruction < instructions.length) {
  const i = instructions[instruction];
  commands[i[0]](sanitize(i[1]), getVal(i[2]));
  instruction++;
}

console.log('part1:', multiplied);

let isPrime = false;
let nonPrimes = 0;
const start =
  parseInt(instructions[0][2], 10) * parseInt(instructions[4][2], 10) -
  parseInt(instructions[5][2], 10);
const end = start - parseInt(instructions[7][2], 10);
for (let numToCheck = start; numToCheck <= end; numToCheck += 17) {
  isPrime = true;
  for (let i = 2; i < numToCheck && isPrime; i++) {
    for (let j = 0; j < numToCheck && isPrime; j++) {
      const prod = i * j;
      if (prod === numToCheck) {
        isPrime = false;
      } else if (prod > numToCheck) {
        break;
      }
    }
  }
  if (!isPrime) {
    nonPrimes += 1;
  }
}

console.log('part2:', nonPrimes);
