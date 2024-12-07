import readInput from '../utils/readInput.ts';
import { splitAndMapInputLines } from '../utils/functions.ts';

const input = readInput();
const instructions = splitAndMapInputLines(input);

type Register = keyof typeof regKeys;
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
const isKey = (x: string): x is Register => regKeysArray.includes(x);
const sanitize = (x: string) => (isKey(x) ? x : parseInt(x, 10));
let instruction = 0;
let multiplied = 0;

const registers = Array(regKeysArray.length).fill(0);
const getVal = (x: string) =>
  isKey(x) ? registers[regKeys[x]] : parseInt(x, 10);

const commands = {
  set: (X: Register, Y: number) => {
    registers[regKeys[X]] = Y;
  },
  sub: (X: Register, Y: number) => {
    registers[regKeys[X]] -= Y;
  },
  mul: (X: Register, Y: number) => {
    multiplied++;
    registers[regKeys[X]] *= Y;
  },
  jnz: (X: Register | number, Y: number) => {
    if (typeof X === 'number') {
      instruction += X !== 0 ? Y - 1 : 0;
    } else {
      instruction += registers[regKeys[X]] !== 0 ? Y - 1 : 0;
    }
  },
};

while (instruction >= 0 && instruction < instructions.length) {
  const i = instructions[instruction];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  commands[i[0]](sanitize(i[1]), getVal(i[2]));
  instruction++;
}

export const part1 = () => multiplied;

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

export const part2 = () => nonPrimes;
