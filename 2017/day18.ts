import readInput from '../utils/readInput.ts';
import { splitAndMapInputLines } from '../utils/functions.ts';

const input = readInput();
const program = splitAndMapInputLines(input);
type Register = keyof typeof regKeys;
const regKeys = {
  a: 0,
  b: 1,
  f: 2,
  i: 3,
  p: 4,
};
const regKeysArray = Object.keys(regKeys);
const isKey = (x: string): x is Register => regKeysArray.includes(x);
const sanitize = (x: string) => (isKey(x) ? x : parseInt(x, 10));
let registers: number[][];
let instructions: number[];
let running = 0;

const getVal = (x: string) =>
  isKey(x) ? registers[running][regKeys[x]] : parseInt(x, 10);

const getCommands = (
  snd: (X: Register | number) => void,
  rcv: (X: Register) => void,
) => ({
  snd,
  rcv,
  jgz: (X: number | Register, Y: number) => {
    if (typeof X === 'number') {
      instructions[running] += X > 0 ? Y - 1 : 0;
    } else {
      instructions[running] += registers[running][regKeys[X]] > 0 ? Y - 1 : 0;
    }
  },
  set: (X: Register, Y: number) => {
    registers[running][regKeys[X]] = Y;
  },
  add: (X: Register, Y: number) => {
    registers[running][regKeys[X]] += Y;
  },
  mul: (X: Register, Y: number) => {
    registers[running][regKeys[X]] *= Y;
  },
  mod: (X: Register, Y: number) => {
    registers[running][regKeys[X]] %= Y;
  },
});

export const part1 = () => {
  let lastSound = -1;
  let recovered = null;
  instructions = [0];
  registers = [new Array(regKeysArray.length).fill(0)];

  const snd = (X: Register | number) => {
    if (typeof X === 'number')
      throw new Error('X should always be a register in part 1');
    lastSound = registers[running][regKeys[X]];
  };
  const rcv = (X: Register) => {
    recovered = registers[running][regKeys[X]] !== 0 ? lastSound : null;
  };
  const commands = getCommands(snd, rcv);

  while (recovered === null) {
    const i = program[instructions[running]];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    commands[i[0]](sanitize(i[1]), getVal(i[2]));
    instructions[running]++;
  }
  return lastSound;
};

export const part2 = () => {
  const queues: number[][] = [[], []];
  const waiting = [false, false];
  const terminated = [false, false];
  instructions = [0, -1];
  running = 0;
  let other = 1;
  let done = false;
  let p1Sends = 0;

  registers = [
    new Array(regKeysArray.length).fill(0),
    new Array(regKeysArray.length).fill(0),
  ];
  registers[1][regKeys.p] = 1;

  const snd = (X: number | Register) => {
    if (running === 1) {
      p1Sends++;
    }
    if (typeof X === 'number') {
      queues[other].push(X);
    } else {
      queues[other].push(registers[running][regKeys[X]]);
    }
  };
  const rcv = (X: Register) => {
    if (queues[running].length > 0) {
      registers[running][regKeys[X]] = queues[running].shift()!;
    } else if (
      queues[other].length === 0 &&
      (waiting[other] || terminated[other])
    ) {
      done = true;
    } else {
      waiting[running] = true;
      instructions[running]--;
      running = 1 - running;
      other = 1 - other;
    }
  };
  const commands = getCommands(snd, rcv);

  while (!done) {
    const i = program[instructions[running]];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    commands[i[0]](sanitize(i[1]), getVal(i[2]));
    instructions[running]++;
  }
  return p1Sends;
};
