import { readInput } from '../utils/functions.js';

const input = readInput();

const getMonkeysObject = () =>
  Object.fromEntries(
    input.split('\n').map((m) => {
      const parts = m.split(': ');
      if (parts[1].indexOf(' ') < 0) {
        parts[1] = parseInt(parts[1], 10);
      } else {
        const { groups } = parts[1].match(
          /(?<m1>[a-z]+) (?<symbol>.) (?<m2>[a-z]+)/,
        );
        parts[1] = groups;
      }
      return parts;
    }),
  );

const reduceTree = (monkeys) => {
  let replaced;
  do {
    replaced = false;
    const numbers = Object.keys(monkeys).filter(
      (m) => typeof monkeys[m] === 'number',
    );
    const objects = Object.keys(monkeys).filter(
      (m) => typeof monkeys[m] !== 'number',
    );

    objects.forEach((o) => {
      if (numbers.includes(monkeys[o].m1)) {
        monkeys[o].m1 = monkeys[monkeys[o].m1];
        replaced = true;
      }
      if (numbers.includes(monkeys[o].m2)) {
        monkeys[o].m2 = monkeys[monkeys[o].m2];
        replaced = true;
      }
    });
    numbers.forEach((n) => {
      if (n !== 'root') delete monkeys[n];
    });

    objects.forEach((o) => {
      if (
        typeof monkeys[o].m1 === 'number' &&
        typeof monkeys[o].m2 === 'number'
      ) {
        switch (monkeys[o].symbol) {
          case '*': {
            monkeys[o] = monkeys[o].m1 * monkeys[o].m2;
            break;
          }
          case '/': {
            monkeys[o] = monkeys[o].m1 / monkeys[o].m2;
            break;
          }
          case '+': {
            monkeys[o] = monkeys[o].m1 + monkeys[o].m2;
            break;
          }
          case '-': {
            monkeys[o] = monkeys[o].m1 - monkeys[o].m2;
            break;
          }
          default: {
            throw new Error('Unexpected symbol');
          }
        }
        replaced = true;
      }
    });
  } while (replaced === true);
};

const solveEquation = (monkeys) => {
  const variableBranch = typeof monkeys.root.m1 === 'number' ? 'm2' : 'm1';
  const constBranch = typeof monkeys.root.m1 === 'number' ? 'm1' : 'm2';
  while (monkeys.root[variableBranch] !== 'humn') {
    const toSolve = monkeys.root[variableBranch];
    const equation = monkeys[toSolve];
    switch (equation.symbol) {
      case '+': {
        if (typeof equation.m1 === 'number') {
          monkeys.root[constBranch] -= equation.m1;
          monkeys.root[variableBranch] = equation.m2;
        } else {
          monkeys.root[constBranch] -= equation.m2;
          monkeys.root[variableBranch] = equation.m1;
        }
        break;
      }
      case '-': {
        if (typeof equation.m1 === 'number') {
          monkeys.root[constBranch] = equation.m1 - monkeys.root[constBranch];
          monkeys.root[variableBranch] = equation.m2;
        } else {
          monkeys.root[constBranch] += equation.m2;
          monkeys.root[variableBranch] = equation.m1;
        }
        break;
      }
      case '*': {
        if (typeof equation.m1 === 'number') {
          monkeys.root[constBranch] /= equation.m1;
          monkeys.root[variableBranch] = equation.m2;
        } else {
          monkeys.root[constBranch] /= equation.m2;
          monkeys.root[variableBranch] = equation.m1;
        }
        break;
      }
      case '/': {
        monkeys.root[constBranch] *= equation.m2;
        monkeys.root[variableBranch] = equation.m1;
        break;
      }
      default: {
        throw new Error('Unexpected symbol');
      }
    }
    delete monkeys[toSolve];
  }
  return monkeys.root[constBranch];
};

const part1 = () => {
  const monkeys = getMonkeysObject();
  reduceTree(monkeys);
  return monkeys.root;
};

const part2 = () => {
  const monkeys = getMonkeysObject();
  delete monkeys.humn;
  reduceTree(monkeys);
  return solveEquation(monkeys);
};

console.log('part1', part1());
console.log('part2', part2());
