import readInput from '../utils/readInput.js';

const input = readInput();
const sues = input.split('\n').map((sue) =>
  Object.fromEntries(
    sue
      .replace(/Sue (\d+):/, 'number: $1,')
      .split(', ')
      .map((property) =>
        property.split(': ').map((k, i) => (i === 0 ? k : parseInt(k, 10))),
      ),
  ),
);

const readout = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1,
};

const part1 = () =>
  sues.filter((sue) =>
    Object.entries(sue).every(
      ([prop, val]) => prop === 'number' || readout[prop] === val,
    ),
  )[0].number;

const part2 = () =>
  sues.filter((sue) =>
    Object.entries(sue).every(([prop, val]) => {
      if (prop === 'number') return true;
      if (['cats', 'trees'].includes(prop)) return val > readout[prop];
      if (['pomeranians', 'goldfish'].includes(prop))
        return val < readout[prop];
      return readout[prop] === val;
    }),
  )[0].number;

console.log('part1', part1());
console.log('part2', part2());
