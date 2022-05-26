import { readInput, permutator } from '../utils/functions.js';

const input = readInput();
const instructions = input.split('\n').map((line) =>
  line
    .split(' ')
    .filter(
      (word, index) =>
        index === 0 || word.length === 1 || word === 'left' || word === 'right',
    )
    .map((char) => (char.match(/[0-9]/) ? parseInt(char, 10) : char)),
);

const scramble = (start) => {
  let str = start;
  instructions.forEach(([inst, a, b]) => {
    switch (inst) {
      case 'swap': {
        const [first, second] =
          typeof a === 'number' ? [a, b] : [str.indexOf(a), str.indexOf(b)];
        const min = Math.min(first, second);
        const max = Math.max(first, second);
        str =
          str.substring(0, min) +
          str[max] +
          str.substring(min + 1, max) +
          str[min] +
          str.substring(max + 1);
        break;
      }
      case 'rotate': {
        const amount =
          b || (str.indexOf(a) + (str.indexOf(a) >= 4 ? 2 : 1)) % str.length;
        const direction = ['left', 'right'].includes(a) ? a : 'right';
        if (direction === 'left') {
          str = str.substring(amount) + str.substring(0, amount);
        } else {
          str =
            str.substring(str.length - amount) +
            str.substring(0, str.length - amount);
        }
        break;
      }
      case 'move': {
        const toMove = str[a];
        if (a > b) {
          str =
            str.substring(0, b) +
            toMove +
            str.substring(b, a) +
            str.substring(a + 1);
        } else {
          str =
            str.substring(0, a) +
            str.substring(a + 1, b + 1) +
            toMove +
            str.substring(b + 1);
        }
        break;
      }
      case 'reverse': {
        let reversed = '';
        for (let i = 0; i <= b - a; i++) {
          reversed += str[b - i];
        }
        str = str.substring(0, a) + reversed + str.substring(b + 1);
        break;
      }
      default:
        throw new Error('Unexpected instruction');
    }
  });
  return str;
};

const part1 = () => scramble('abcdefgh');

const part2 = () => {
  const permutations = permutator(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
  const answer = 'fbgdceah';
  for (const p of permutations) {
    const test = p.join('');
    if (scramble(test) === answer) return test;
  }
};

console.log('part1', part1());
console.log('part2', part2());
