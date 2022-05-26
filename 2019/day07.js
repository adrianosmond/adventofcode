import input from './input07.js';
// Array of integers
import { intComputer } from './intComputer.js';

function* choose5(start = 0) {
  for (let A = start; A < start + 5; A++) {
    for (let B = start; B < start + 5; B++) {
      if (B !== A) {
        for (let C = start; C < start + 5; C++) {
          if (C !== A && C !== B) {
            for (let D = start; D < start + 5; D++) {
              if (D !== A && D !== B && D !== C) {
                for (let E = start; E < start + 5; E++) {
                  if (E !== A && E !== B && E !== C && E !== D) {
                    yield [A, B, C, D, E];
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

const makeAmplifier = (inputValues) => intComputer(input, inputValues);

const runAmp = (amp, ampInputs, prevAmpOutput) => {
  ampInputs.push(prevAmpOutput);
  const { value } = amp.next();
  if (value) {
    return [value, false];
  }
  return [prevAmpOutput, true];
};

const day7part1 = () => {
  let bestOutput = Number.MIN_SAFE_INTEGER;
  let lastOutput = 0;

  for (const phases of choose5()) {
    lastOutput = phases.reduce(
      (prev, phase) => intComputer(input, [phase, prev]).next().value,
      0,
    );
    bestOutput = Math.max(lastOutput, bestOutput);
  }
  return bestOutput;
};

const day7part2 = () => {
  let bestOutput = Number.MIN_SAFE_INTEGER;

  for (const phases of choose5(5)) {
    const inputs = phases.map((phase) => [phase]);
    const amps = inputs.map((i) => makeAmplifier(i));
    let lastOutput = 0;
    let done = false;

    while (!done) {
      [lastOutput, done] = amps.reduce(
        ([prev], amp, idx) => runAmp(amp, inputs[idx], prev),
        [lastOutput, done],
      );
    }

    bestOutput = Math.max(lastOutput, bestOutput);
  }
  return bestOutput;
};

console.log('part1:', day7part1());
console.log('part2:', day7part2());
