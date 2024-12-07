import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';
import { intComputer } from './intComputer.ts';

const input = strToIntArray(readInput(), ',');

const NUM_COMPUTERS = 50;

const rebuildNetwork = (part2 = false) => {
  const computers = new Array(NUM_COMPUTERS);
  const inputs: number[][] = new Array(NUM_COMPUTERS).fill(0).map(() => []);
  let idleCount = 0;
  let nat = null;
  const natSent: Record<string, boolean> = {};

  for (let i = 0; i < NUM_COMPUTERS; i++) {
    inputs[i].push(i);
    computers[i] = intComputer(input, inputs[i], {
      blockForInput: true,
      emptyInputArray: true,
    });
  }

  while (true) {
    for (let i = 0; i < NUM_COMPUTERS; i++) {
      const addr = computers[i].next().value;
      if (addr !== Number.MIN_SAFE_INTEGER) {
        const x = computers[i].next().value;
        const y = computers[i].next().value;
        if (addr < NUM_COMPUTERS) {
          inputs[addr].push(x, y);
        }
        if (addr === 255) {
          if (!nat && !part2) {
            return y;
          }
          nat = [x, y];
        }
      } else if (inputs[i].length === 0) {
        inputs[i].push(-1);
      }
    }
    if (inputs.map((i) => i.length).every((v) => v === 1)) {
      idleCount++;
    } else {
      idleCount = 0;
    }
    if (nat && idleCount === 2) {
      const str = nat.join(',');
      if (natSent[str]) {
        return nat[1];
      }
      natSent[str] = true;
      inputs[0].push(...nat);
    }
  }
};

export const part1 = () => rebuildNetwork();

export const part2 = () => rebuildNetwork(true);
