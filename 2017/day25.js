import readInput from '../utils/readInput.js';
import { sum } from '../utils/reducers.js';

const input = readInput();
const [setup, ...startStates] = input.split('\n\n');
const [, startState, csum] = setup.match(
  /Begin in state (\w).\nPerform a diagnostic checksum after (\d+) steps./,
);
const checksumAfter = parseInt(csum, 10);
const states = {};
startStates.forEach((s) => {
  const [statKey, ...rules] = s
    .replace(/\n\s+/g, '\n')
    .replace(/:/g, '')
    .replace(/\./g, '')
    .replace(/In state /g, '')
    .replace(/If the current value is \d\n/g, '')
    .replace(/- Write the value /g, '')
    .replace(/- Move one slot to the /g, '')
    .replace(/- Continue with state /g, '')
    .split('\n');
  states[statKey] = [
    {
      write: parseInt(rules[0], 10),
      move: rules[1] === 'right' ? 1 : -1,
      state: rules[2],
    },
    {
      write: parseInt(rules[3], 10),
      move: rules[4] === 'right' ? 1 : -1,
      state: rules[5],
    },
  ];
});

let ptr = 100000;
const tape = new Array(ptr * 2).fill(0);
let currentState = startState;

for (let i = 0; i < checksumAfter; i++) {
  const { write, move, state } = states[currentState][tape[ptr]];
  tape[ptr] = write;
  ptr += move;
  currentState = state;
}

const checksum = tape.reduce(sum);
console.log('part1:', checksum);
