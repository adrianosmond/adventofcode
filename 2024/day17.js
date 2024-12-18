import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';

const input = readInput();
const [r, p] = input.split('\n\n');
const registers = r
  .split('\n')
  .map((l) => parseInt(l.match(/Register [ABC]: (\d+)/)[1], 10));
const program = strToIntArray(p.replace('Program: ', ''), ',');

const getCombo = (operand) => {
  if (operand < 4) return operand;
  if (operand < 7) return registers[operand - 4];
  throw new Error('Invalid combo operand');
};

const runProgram = (part2 = false) => {
  let iPtr = 0;
  const output = [];
  while (iPtr < program.length) {
    const opCode = program[iPtr];
    const operand = program[iPtr + 1];
    switch (opCode) {
      case 0: {
        // ADV
        if (!part2) {
          registers[0] = Math.floor(registers[0] / 2 ** getCombo(operand));
        }
        break;
      }
      case 1: {
        // BXL
        registers[1] = (registers[1] ^ operand) >>> 0;
        break;
      }
      case 2: {
        // BST
        registers[1] = getCombo(operand) % 8;
        break;
      }
      case 3: {
        // JNZ
        if (registers[0] !== 0) {
          iPtr = operand;
          continue;
        }
        break;
      }
      case 4: {
        // BXC
        registers[1] = (registers[1] ^ registers[2]) >>> 0;
        break;
      }
      case 5: {
        // OUT
        if (part2) return getCombo(operand) % 8;
        output.push(getCombo(operand) % 8);
        break;
      }
      case 6: {
        // BDV
        registers[1] = Math.floor(registers[0] / 2 ** getCombo(operand));
        break;
      }
      case 7: {
        // CDV
        registers[2] = Math.floor(registers[0] / 2 ** getCombo(operand));
        break;
      }
      default:
        throw new Error('Unexpected opCode');
    }
    iPtr += 2;
  }
  return output.join(',');
};

const findLowestA = (target, answer) => {
  if (target.length === 0) return answer;
  for (let t = 0; t < 8; t++) {
    registers[0] = answer * 8 + t;
    registers[1] = 0;
    registers[2] = 0;

    const output = runProgram(true);

    if (output === target.at(-1)) {
      const ans = findLowestA(target.slice(0, -1), registers[0]);
      if (ans) return ans;
    }
  }
};

export const part1 = () => runProgram();

// Part 2 was too much for me. Found a decent explanation here:
// https://www.youtube.com/watch?v=y-UPxMAh2N8, which is where
// this approach comes from
export const part2 = () => findLowestA(program, 0);
