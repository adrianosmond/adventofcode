import input from './input23.js';

import { intComputer } from './intComputer.js';

const NUM_COMPUTERS = 50;

const day23 = () => {
  const computers = new Array(NUM_COMPUTERS);
  const inputs = new Array(NUM_COMPUTERS).fill().map(() => []);
  let idleCount = 0;
  let nat = null;
  const natSent = {};

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
          if (!nat) {
            console.log('part1:', y);
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
console.log('part2:', day23());
