import readInput from '../utils/readInput.js';
import { splitAndMapInputLines } from '../utils/functions.js';

const input = readInput();
const program = splitAndMapInputLines(input);
const regKeys = {
  a: 0,
  b: 1,
  f: 2,
  i: 3,
  p: 4,
};
const regKeysArray = Object.keys(regKeys);
const isKey = (x) => regKeysArray.includes(x);
const sanitize = (x) => (isKey(x) ? x : parseInt(x, 10));
let registers;
let instructions;
let running = 0;

const getVal = (x) =>
  isKey(x) ? registers[running][regKeys[x]] : parseInt(x, 10);

const getCommands = (snd, rcv) => ({
  snd,
  rcv,
  jgz: (X, Y) => {
    if (typeof X === 'number') {
      instructions[running] += X > 0 ? Y - 1 : 0;
    } else {
      instructions[running] += registers[running][regKeys[X]] > 0 ? Y - 1 : 0;
    }
  },
  set: (X, Y) => {
    registers[running][regKeys[X]] = Y;
  },
  add: (X, Y) => {
    registers[running][regKeys[X]] += Y;
  },
  mul: (X, Y) => {
    registers[running][regKeys[X]] *= Y;
  },
  mod: (X, Y) => {
    registers[running][regKeys[X]] %= Y;
  },
});

function day18Part1() {
  let lastSound = -1;
  let recovered = null;
  instructions = [0];
  registers = [new Array(regKeysArray.length).fill(0)];

  const snd = (X) => {
    lastSound = registers[running][regKeys[X]];
  };
  const rcv = (X) => {
    recovered = registers[running][regKeys[X]] !== 0 ? lastSound : null;
  };
  const commands = getCommands(snd, rcv);

  while (recovered === null) {
    const i = program[instructions[running]];
    commands[i[0]](sanitize(i[1]), getVal(i[2]));
    instructions[running]++;
  }
  return lastSound;
}

function day18Part2() {
  const queues = [[], []];
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

  const snd = (X) => {
    if (running === 1) {
      p1Sends++;
    }
    if (typeof X === 'number') {
      queues[other].push(X);
    } else {
      queues[other].push(registers[running][regKeys[X]]);
    }
  };
  const rcv = (X) => {
    if (queues[running].length > 0) {
      registers[running][regKeys[X]] = queues[running].shift();
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
    commands[i[0]](sanitize(i[1]), getVal(i[2]));
    instructions[running]++;
  }
  return p1Sends;
}

console.log('part1:', day18Part1());
console.log('part2:', day18Part2());
