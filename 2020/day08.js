const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input08.txt'), 'utf8');

const instructions = input
  .replace(/\+/g, '')
  .split('\n')
  .map((i) => i.split(' '))
  .map(([i, v]) => [i, parseInt(v, 10)]);

const part1 = () => {
  const visited = [];

  let acc = 0;
  let ptr = 0;
  while (ptr < instructions.length) {
    if (visited[ptr] === true) {
      break;
    }
    visited[ptr] = true;

    const [instruction, value] = instructions[ptr];
    switch (instruction) {
      case 'acc':
        acc += value;
        ptr++;
        break;
      case 'jmp':
        ptr += value;
        break;
      default:
        ptr++;
        break;
    }
  }
  return acc;
};

const part2 = () => {
  for (let i = 0; i < instructions.length; i++) {
    if (instructions[i][0] === 'acc') continue;
    if (instructions[i][0] === 'jmp') {
      instructions[i][0] = 'nop';
    } else {
      instructions[i][0] = 'jmp';
    }
    let success = true;
    const visited = [];

    let acc = 0;
    let ptr = 0;

    while (ptr < instructions.length) {
      if (visited[ptr] === true) {
        success = false;
        break;
      }
      visited[ptr] = true;

      const [instruction, value] = instructions[ptr];
      switch (instruction) {
        case 'acc':
          acc += value;
          ptr++;
          break;
        case 'jmp':
          ptr += value;
          break;
        default:
          ptr++;
          break;
      }
    }
    if (success) {
      return acc;
    }
    if (instructions[i][0] === 'jmp') {
      instructions[i][0] = 'nop';
    } else {
      instructions[i][0] = 'jmp';
    }
  }
};

console.log('part1', part1());
console.log('part2', part2());
