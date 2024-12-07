import readInput from '../utils/readInput.ts';
import { sum } from '../utils/reducers.ts';

const input = readInput();

let sanitised = input.replace(/!./g, '');
let inputLength = sanitised.length;
let prevInputLength = 0;
let removedInputLength = 2;

while (inputLength !== prevInputLength) {
  prevInputLength = inputLength;
  sanitised = sanitised.replace(/<[^>]*>/, '');
  inputLength = sanitised.length;
  removedInputLength += prevInputLength - inputLength;
  removedInputLength -= 2;
}

type Structure = {
  children: Structure[];
  start: number;
  end: number;
};

const buildStructure = (start: number): Structure => {
  const structure: Structure = { children: [], start: 0, end: 0 };
  for (let i = start + 1; i < sanitised.length; i++) {
    if (sanitised[start] !== '{') throw new Error('Huh?');
    structure.start = start;
    if (sanitised[i] === '}') {
      structure.end = i;
      return structure;
    }
    if (sanitised[i] === '{') {
      const child = buildStructure(i);
      i = child.end;
      structure.children.push(child);
    }
  }
  throw new Error('Not found');
};

const score = (pts: number, structure: Structure): number =>
  pts +
  structure.children.map((c: Structure) => score(pts + 1, c)).reduce(sum, 0);

export const part1 = () => score(1, buildStructure(0));

export const part2 = () => removedInputLength;
