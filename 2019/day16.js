// const input = require('./input16');
const input = '12345678';
const signal = input.split('').map(x => parseInt(x, 10));
const phases = [signal, new Array(signal.length).fill(0)];
const base = [0, 1, 0, -1];

const getMultiplier = (phase, digit) => {
  const pos = Math.floor((digit + 1) / (phase + 1)) % base.length;
  return base[pos];
};
console.log(input);

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
  console.log(phases[pNext].join(''));
}

console.log('part1:', phases[0].slice(0, 8).join(''));
