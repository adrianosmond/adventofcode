const input = require('./input16');

const signal = input.split('').map(x => parseInt(x, 10));
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
    for (let j = 0; j < signal.length; j++) {
      total += phases[p][j] * getMultiplier(i, j);
    }
    phases[pNext][i] = Math.abs(total) % 10;
  }
}

console.log('part1:', phases[0].slice(0, 8).join(''));

let input10000 = '';
for (let i = 0; i < 10000; i++) {
  input10000 += input;
}

const start = parseInt(input.substr(0, 7), 10);
input10000 = input10000
  .substr(start)
  .split('')
  .map(x => parseInt(x, 10));

for (let phase = 0; phase < 100; phase++) {
  for (let i = input10000.length - 2; i >= 0; i--) {
    input10000[i] += input10000[i + 1];
    input10000[i] %= 10;
  }
}

console.log('part2:', input10000.slice(0, 8).join(''));
