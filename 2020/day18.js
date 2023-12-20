import readInput from '../utils/readInput.js';
import { sum } from '../utils/reducers.js';

const input = readInput();

const equations = input.split('\n');

const evaluateLtoR = (equation) => {
  let withoutBrackets = equation;
  while (withoutBrackets.indexOf('(') >= 0) {
    withoutBrackets = withoutBrackets.replace(/\([^())]+\)/g, (match) =>
      evaluateLtoR(match.replace(/[()]/g, '')),
    );
  }

  const e = withoutBrackets.split(' ');
  let result = parseInt(e[0], 10);
  for (let i = 1; i < e.length; i += 2) {
    const operator = e[i];
    const operand = parseInt(e[i + 1], 10);
    if (operator === '*') {
      result *= operand;
    } else {
      result += operand;
    }
  }

  return result;
};

const evaluateAdditionFirst = (equation) => {
  let withoutBrackets = equation;
  while (withoutBrackets.indexOf('(') >= 0) {
    withoutBrackets = withoutBrackets.replace(/\([^())]+\)/g, (match) =>
      evaluateAdditionFirst(match.replace(/[()]/g, '')),
    );
  }

  while (withoutBrackets.indexOf('+') >= 0) {
    withoutBrackets = withoutBrackets.replace(/\d+ \+ \d+/g, (match) => {
      const [, n1, n2] = match.match(/(\d+) \+ (\d+)/);
      return parseInt(n1, 10) + parseInt(n2, 10);
    });
  }

  return withoutBrackets
    .split(' * ')
    .reduce((total, current) => total * parseInt(current, 10), 1);
};

const part1 = () => equations.map(evaluateLtoR).reduce(sum);

const part2 = () => equations.map(evaluateAdditionFirst).reduce(sum);

console.log('part1', part1());
console.log('part2', part2());
