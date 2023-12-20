import readInput from '../utils/readInput.js';
import { permutator, strToIntArray } from '../utils/functions.js';
import { intComputer } from './intComputer.js';

const input = strToIntArray(readInput(), ',');

const makeAmplifier = (inputValues) => intComputer(input, inputValues);

const runAmp = (amp, ampInputs, prevAmpOutput) => {
  ampInputs.push(prevAmpOutput);
  const { value } = amp.next();
  if (value) {
    return [value, false];
  }
  return [prevAmpOutput, true];
};

export const part1 = () => {
  let bestOutput = Number.MIN_SAFE_INTEGER;
  let lastOutput = 0;
  const permutations = permutator([0, 1, 2, 3, 4]);

  for (const phases of permutations) {
    lastOutput = phases.reduce(
      (prev, phase) => intComputer(input, [phase, prev]).next().value,
      0,
    );
    bestOutput = Math.max(lastOutput, bestOutput);
  }
  return bestOutput;
};

export const part2 = () => {
  let bestOutput = Number.MIN_SAFE_INTEGER;
  const permutations = permutator([5, 6, 7, 8, 9]);

  for (const phases of permutations) {
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
