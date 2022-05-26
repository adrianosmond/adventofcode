import input from './input09.js';
import { sum } from '../utils/reducers.js';

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

const buildStructure = (start) => {
  const structure = { children: [] };
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

const score = (pts, structure) =>
  pts + structure.children.map((c) => score(pts + 1, c)).reduce(sum, 0);

console.log('part1:', score(1, buildStructure(0)));
console.log('part2:', removedInputLength);
