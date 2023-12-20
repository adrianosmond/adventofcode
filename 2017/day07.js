import readInput from '../utils/readInput.js';
import { splitAndMapInputLines } from '../utils/functions.js';
import { mergeObjects, sum as sumFn } from '../utils/reducers.js';

const input = readInput();
const programs = splitAndMapInputLines(input, ' -> ')
  .map(([l, r]) => {
    const [key, val] = l.split(' ');
    const weight = parseInt(val.replace(/[()]/g, ''), 10);
    return {
      [key]: {
        weight,
        ...(r && { children: r.split(', ') }),
      },
    };
  })
  .reduce(mergeObjects, {});

const flatten = (list) =>
  list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

const withChildren = Object.keys(programs).filter((i) => programs[i].children);

flatten(withChildren.map((i) => programs[i].children)).forEach((child) => {
  programs[child].isBottom = false;
});

const bottom = Object.keys(programs).filter(
  (i) => typeof programs[i].isBottom === 'undefined',
)[0];

function findImbalance(prog) {
  const program = programs[prog];
  let weights = [];
  let sum = 0;
  if (program.children) {
    weights = program.children.map(findImbalance);
    sum = weights.reduce(sumFn, 0);
    if (sum / weights.length !== weights[0]) {
      const outlier = weights.find(
        (w) => weights.filter((ww) => ww !== w).length > 1,
      );
      const outlierIdx = weights.indexOf(outlier);
      const normal = outlier === weights[0] ? weights[1] : weights[0];
      const diff = normal - outlier;
      return programs[program.children[outlierIdx]].weight + diff;
    }
  }
  return program.weight + sum;
}

export const part1 = () => bottom;

export const part2 = () => findImbalance(bottom);
