import readInput from '../utils/readInput.ts';

const input = readInput();

type Symbol = '*' | '+' | '/' | '-';
type ObjectMonkey = {
  m1: string | number;
  symbol: Symbol;
  m2: string | number;
};
type Monkeys = Record<string, number | ObjectMonkey>;

const getMonkeysObject = (): Monkeys =>
  Object.fromEntries(
    input.split('\n').map((m) => {
      const parts = m.split(': ');
      if (parts[1].indexOf(' ') < 0) {
        return [parts[0], parseInt(parts[1], 10)];
      } else {
        const { groups } = parts[1].match(
          /(?<m1>[a-z]+) (?<symbol>.) (?<m2>[a-z]+)/,
        )!;
        return [parts[0], groups];
      }
    }),
  );

const reduceTree = (monkeys: Monkeys) => {
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
      const monkey = monkeys[o] as ObjectMonkey;
      if (typeof monkey.m1 === 'string' && numbers.includes(monkey.m1)) {
        monkey.m1 = monkeys[monkey.m1] as number;
        replaced = true;
      }
      if (typeof monkey.m2 === 'string' && numbers.includes(monkey.m2)) {
        monkey.m2 = monkeys[monkey.m2] as number;
        replaced = true;
      }
    });
    numbers.forEach((n) => {
      if (n !== 'root') delete monkeys[n];
    });

    objects.forEach((o) => {
      const monkey = monkeys[o] as ObjectMonkey;
      if (typeof monkey.m1 === 'number' && typeof monkey.m2 === 'number') {
        switch (monkey.symbol) {
          case '*': {
            monkeys[o] = monkey.m1 * monkey.m2;
            break;
          }
          case '/': {
            monkeys[o] = monkey.m1 / monkey.m2;
            break;
          }
          case '+': {
            monkeys[o] = monkey.m1 + monkey.m2;
            break;
          }
          case '-': {
            monkeys[o] = monkey.m1 - monkey.m2;
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

const solveEquation = (monkeys: Monkeys) => {
  const root = monkeys.root as ObjectMonkey;
  const variableBranch = typeof root.m1 === 'number' ? 'm2' : 'm1';
  const constBranch = typeof root.m1 === 'number' ? 'm1' : 'm2';
  while (root[variableBranch] !== 'humn') {
    const toSolve = root[variableBranch];
    const equation = monkeys[toSolve] as ObjectMonkey;
    switch (equation.symbol) {
      case '+': {
        if (typeof equation.m1 === 'number') {
          (root[constBranch] as number) -= equation.m1;
          root[variableBranch] = equation.m2;
        } else if (typeof equation.m2 === 'number') {
          (root[constBranch] as number) -= equation.m2;
          root[variableBranch] = equation.m1;
        }
        break;
      }
      case '-': {
        if (typeof equation.m1 === 'number') {
          root[constBranch] = equation.m1 - (root[constBranch] as number);
          root[variableBranch] = equation.m2;
        } else if (typeof equation.m2 === 'number') {
          (root[constBranch] as number) += equation.m2;
          root[variableBranch] = equation.m1;
        }
        break;
      }
      case '*': {
        if (typeof equation.m1 === 'number') {
          (root[constBranch] as number) /= equation.m1;
          root[variableBranch] = equation.m2;
        } else if (typeof equation.m2 === 'number') {
          (root[constBranch] as number) /= equation.m2;
          root[variableBranch] = equation.m1;
        }
        break;
      }
      case '/': {
        (root[constBranch] as number) *= equation.m2 as number;
        root[variableBranch] = equation.m1;
        break;
      }
      default: {
        throw new Error('Unexpected symbol');
      }
    }
    delete monkeys[toSolve];
  }
  return root[constBranch] as number;
};

export const part1 = () => {
  const monkeys = getMonkeysObject();
  reduceTree(monkeys);
  return monkeys.root;
};

export const part2 = () => {
  const monkeys = getMonkeysObject();
  delete monkeys.humn;
  reduceTree(monkeys);
  return solveEquation(monkeys);
};
