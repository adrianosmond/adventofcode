import readInput from '../utils/readInput.js';

const input = readInput();
const json = JSON.parse(input);

const getSumOfValues = (vals, ignoreRed = false) =>
  vals.reduce((total, val) => {
    if (typeof val === 'string') return total;
    if (typeof val === 'number') return total + val;
    if (Array.isArray(val)) return total + getSumOfValues(val, ignoreRed);
    if (ignoreRed && Object.values(val).includes('red')) return total;
    return total + getSumOfValues(Object.values(val), ignoreRed);
  }, 0);

const part1 = () => getSumOfValues(Object.values(json));

const part2 = () => getSumOfValues(Object.values(json), true);

console.log('part1', part1());
console.log('part2', part2());
