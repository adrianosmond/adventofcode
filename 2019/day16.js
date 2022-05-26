import input from './input16.js';

const signal = input.split('').map((x) => parseInt(x, 10));
const phases = [signal, new Array(signal.length).fill(0)];
const base = [0, 1, 0, -1];

const getMultiplier = (phase, digit) => {
  const pos = Math.floor((digit + 1) / (phase + 1)) % base.length;
  return base[pos];
};

for (let phase = 0; phase < 100; phase++) {
  const p = phase % 2;
  const pNext = (phase + 1) % 2;
  for (let i = 0; i < signal.length; i++) {
    let total = 0;
    // The first i multipliers will be 0, so we can skip them
    for (let j = i; j < signal.length; j++) {
      total += phases[p][j] * getMultiplier(i, j);
    }
    phases[pNext][i] = Math.abs(total) % 10;
  }
}

console.log('part1:', phases[0].slice(0, 8).join(''));

const start = parseInt(input.substr(0, 7), 10);
const input2Len = input.length * 10000 - start;

let inputPart2 = '';
for (let i = 0; i < Math.ceil(input2Len / input.length); i++) {
  inputPart2 += input;
}

inputPart2 = inputPart2
  .substr(inputPart2.length - input2Len)
  .split('')
  .map((x) => parseInt(x, 10));

for (let phase = 0; phase < 100; phase++) {
  for (let i = inputPart2.length - 2; i >= 0; i--) {
    inputPart2[i] += inputPart2[i + 1];
    inputPart2[i] %= 10;
  }
}

console.log('part2:', inputPart2.slice(0, 8).join(''));
