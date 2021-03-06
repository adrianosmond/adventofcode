const input = require('./input06');
const { highestWithIndex } = require('../utils/reducers');

const banks = input.length;
let loops = 0;
const history = [];
let prevIndex = -1;

while (true) {
  const { best, index } = input.reduce(highestWithIndex, {
    best: -1,
    index: -1,
  });
  const fraction = best / banks;
  const floor = Math.floor(fraction);
  const ceil = Math.ceil(fraction);
  let remainder = best % banks;
  input[index] = 0;
  for (let j = 1; j <= banks; j++) {
    if (remainder > 0) {
      input[(index + j) % banks] += ceil;
      remainder--;
    } else {
      input[(index + j) % banks] += floor;
    }
  }
  loops++;
  const state = input.join(',');
  prevIndex = history.indexOf(state);
  if (prevIndex > -1) {
    break;
  } else {
    history.push(state);
  }
}

console.log('part1:', loops);
console.log('part2:', loops - prevIndex - 1);
