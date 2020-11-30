const input = require('./input08')
  .split('\n')
  .map((inst) => inst.split(' '));

const reg = {};
const ops = {
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
  '==': (a, b) => a === b,
  '!=': (a, b) => a !== b,
};

let max = 0;

input.forEach((instruction) => {
  const [target, action, amt, , condTarget, condition, condAmt] = instruction;
  const amount = parseInt(amt, 10);
  const condAmount = parseInt(condAmt, 10);
  if (!reg[target]) {
    reg[target] = 0;
  }
  if (!reg[condTarget]) {
    reg[condTarget] = 0;
  }
  if (ops[condition](reg[condTarget], condAmount)) {
    if (action === 'inc') {
      reg[target] += amount;
    }
    if (action === 'dec') {
      reg[target] -= amount;
    }
    max = Math.max(max, reg[target]);
  }
});

console.log('part1:', Math.max(...Object.values(reg)));
console.log('part2:', max);
