import md5 from 'spark-md5';
import { readInput, sortAsc } from '../utils/functions.js';

const input = readInput();

const chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];

const getTriple = (hash) => {
  for (let i = 0; i < hash.length < 2; i++) {
    if (hash[i] === hash[i + 1] && hash[i] === hash[i + 2]) {
      return hash[i];
    }
  }
  return undefined;
};

const makeArrays = () => {
  const obj = {};
  chars.forEach((c) => {
    obj[c] = [];
  });
  return obj;
};

const fives = {};
chars.forEach((c) => {
  fives[c] = new Array(5).fill(c).join('');
});

const hasFive = (hash, digit) => hash.includes(fives[digit]);

const findKeys = (numHashes = 1) => {
  let i = 0;
  const indexes = [];
  const lastSeen = makeArrays();
  const potentials = makeArrays();
  let max = 0;

  while (indexes.length < 64 || i <= max + 1000) {
    let hash = md5.hashBinary(`${input}${i}`);
    for (let j = 0; j < numHashes - 1; j++) {
      hash = md5.hashBinary(hash);
    }
    const triple = indexes.length < 64 && getTriple(hash);
    if (triple) {
      lastSeen[triple] = i;
      max = i;
      potentials[triple].push({
        i,
        triple,
        hash,
      });
    }
    for (let j = 0; j < chars.length; j++) {
      const c = chars[j];
      if (lastSeen[c] + 1000 >= i) {
        if (hasFive(hash, c)) {
          while (potentials[c].length > 0 && potentials[c][0].i !== i) {
            const match = potentials[c].shift();
            if (match.i + 1000 >= i) {
              indexes.push(match.i);
            }
          }
        }
      }
    }
    i++;
  }
  indexes.sort(sortAsc);
  return indexes[63];
};

console.log('part1', findKeys());
console.log('part2', findKeys(2017));
