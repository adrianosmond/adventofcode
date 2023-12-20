import readInput from '../utils/readInput.js';
import { sum } from '../utils/reducers.js';

let input = readInput();

let inputLen = input.length;
while (true) {
  // things like "s<1158:R,R" are just a waste of time as it doesn't matter
  // what the condition is, the outcome is the same either way.
  input = input.replace(/[xmas][<>]\d+:R,R/g, 'R');
  input = input.replace(/[xmas][<>]\d+:A,A/g, 'A');
  if (input.length === inputLen) break;
  inputLen = input.length;
}

let [workflows, items] = input.split('\n\n').map((x) => x.split('\n'));
workflows = Object.fromEntries(
  workflows
    .map((w) => w.replace('}', '').split('{'))
    .map(([k, v]) => [
      k,
      v.split(',').map((condition) => {
        if (condition.indexOf(':') < 0) return [condition]; // only have a destination
        const [cont, dest] = condition.split(':');
        return [
          cont[0], // category e.g. x|m|a|s
          cont[1], // symbol e.g. <|>
          parseInt(cont.substring(2), 10), // value
          dest,
        ];
      }),
    ]),
);

items = items
  .map((i) => i.replace(/=/g, ':'))
  .map((i) => i.replace(/([xmas])/g, '"$1"'))
  .map((i) => JSON.parse(i));

const countCombinations = (combinations) => {
  const range = {
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
  };
  combinations.forEach(([category, symbol, val]) => {
    if (symbol === '<')
      range[category][1] = Math.min(range[category][1], val - 1);
    else range[category][0] = Math.max(range[category][0], val + 1);
  });

  return Object.values(range).reduce(
    (total, [min, max]) => (1 + (max - min)) * total,
    1,
  );
};

const opposite = (category, symbol, val) => {
  if (symbol === '<') return [category, '>', val - 1];
  return [category, '<', val + 1];
};

const traverseWorkflows = (workflow, conditionsFromPrevWorkflows = []) => {
  const conditionsFromThisWorkflow = [];
  let combinations = 0;
  for (const condition of workflows[workflow]) {
    if (condition.length === 1) {
      const dest = condition[0];
      if (dest === 'R') {
        // do nothing for a rejection
      } else if (dest === 'A') {
        combinations += countCombinations([
          ...conditionsFromPrevWorkflows,
          ...conditionsFromThisWorkflow,
        ]);
      } else {
        combinations += traverseWorkflows(dest, [
          ...conditionsFromPrevWorkflows,
          ...conditionsFromThisWorkflow,
        ]);
      }
    } else {
      const [category, symbol, val, dest] = condition;
      if (dest === 'A') {
        combinations += countCombinations([
          ...conditionsFromPrevWorkflows,
          ...conditionsFromThisWorkflow,
          [category, symbol, val],
        ]);
      } else if (dest === 'R') {
        // do nothing for a rejection
      } else {
        combinations += traverseWorkflows(dest, [
          ...conditionsFromPrevWorkflows,
          ...conditionsFromThisWorkflow,
          [category, symbol, val],
        ]);
      }
      // we're now moving on to the next option. in order for that
      // to match, the opposite of this condition must be the case
      conditionsFromThisWorkflow.push(opposite(category, symbol, val));
    }
  }
  return combinations;
};

const part1 = () => {
  let total = 0;
  items.forEach((item) => {
    let w = 'in';
    while (w !== 'R' && w !== 'A') {
      for (const condition of workflows[w]) {
        if (condition.length === 1) {
          w = condition[0];
          break;
        }
        const [category, symbol, val, dest] = condition;
        if (symbol === '<' && item[category] < val) {
          w = dest;
          break;
        }
        if (symbol === '>' && item[category] > val) {
          w = dest;
          break;
        }
      }
    }

    if (w === 'A') total += Object.values(item).reduce(sum);
  });
  return total;
};

const part2 = () => traverseWorkflows('in');

console.log('part1', part1());
console.log('part2', part2());
