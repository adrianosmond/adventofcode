import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';

const input = readInput();

export const part1 = () => {
  let output = '';
  let markerStart = -1;
  for (let i = 0; i < input.length; i++) {
    if (markerStart >= 0 && input[i] === ')') {
      const [len, repeats] = strToIntArray(
        input.substring(markerStart, i),
        'x',
      );
      for (let j = 0; j < repeats; j++) {
        output += input.substr(i + 1, len);
      }
      i += len;
      markerStart = -1;
    } else if (markerStart < 0 && input[i] === '(') {
      markerStart = i + 1;
    } else if (markerStart < 0) {
      output += input[i];
    }
  }
  return output.length;
};

const getLengths = (str) => {
  if (!str.includes('(')) return str.length;
  let s = str;
  let ptr = 0;
  let length = 0;
  while (ptr < s.length) {
    ptr = s.indexOf('(');
    if (ptr === -1) {
      length += s.length;
      break;
    } else if (ptr > 0) {
      length += ptr;
      s = s.substr(ptr);
      ptr = 0;
    } else {
      const end = s.indexOf(')');
      const [len, repeats] = strToIntArray(s.substring(ptr + 1, end), 'x');

      length += repeats * getLengths(s.substr(end + 1, len));
      s = s.substr(end + 1 + len);
      ptr = 0;
    }
  }
  return length;
};

export const part2 = () => getLengths(input);
