import readInput from '../utils/readInput.ts';
import { splitAndMapInputLines } from '../utils/functions.ts';
import { mergeObjects, sum as sumFn } from '../utils/reducers.ts';

const input = readInput();
type Programs = Record<
  string,
  {
    children?: string[];
    weight: number;
    isBottom?: boolean;
  }
>;
const programs: Programs = splitAndMapInputLines(input, ' -> ')
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

const withChildren = Object.keys(programs).filter((i) => programs[i].children);

withChildren
  .map((i) => programs[i].children)
  .flat()
  .forEach((child) => {
    programs[child as string].isBottom = false;
  });

const bottom = Object.keys(programs).filter(
  (i) => typeof programs[i].isBottom === 'undefined',
)[0];

let part2Answer: number;

function findImbalance(prog: string) {
  const program = programs[prog];
  let weights: number[] = [];
  let sum = 0;
  if (program.children) {
    weights = program.children.map(findImbalance);
    sum = weights.reduce(sumFn, 0);
    if (sum / weights.length !== weights[0]) {
      const outlier = weights.find(
        (w) => weights.filter((ww) => ww !== w).length > 1,
      )!;
      const outlierIdx = weights.indexOf(outlier);
      const normal = outlier === weights[0] ? weights[1] : weights[0];
      const diff = normal - outlier;
      part2Answer = programs[program.children[outlierIdx]].weight + diff;
      return program.weight + weights.length * normal;
    }
  }
  return program.weight + sum;
}

export const part1 = () => bottom;

export const part2 = () => {
  findImbalance(bottom);
  return part2Answer;
};
