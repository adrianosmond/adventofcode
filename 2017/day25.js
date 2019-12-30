const { sum } = require('../utils/reducers');
const { startState, states, checksumAfter } = require('./input25');
/**
 * states should be an object which takes the form: {
    A: [ // In state A
      { // If value === 0
        write: 1,
        move: 1,
        state: 'B',
      },
      { // If value === 1
        write: 0,
        move: -1,
        state: 'B',
      },
    ],
    ...
  }
 */

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
