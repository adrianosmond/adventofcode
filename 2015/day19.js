import { readInput } from '../utils/functions.js';

const input = readInput();

const [replacements, target] = input.split('\n\n');
const possibles = replacements.split('\n').map((p) => p.split(' => '));

const expand = (molecule) => {
  const newMolecules = new Set([]);

  for (let i = 0; i < molecule.length; i++) {
    for (const [m, r] of possibles) {
      if (molecule.substring(i, i + m.length) === m) {
        newMolecules.add(
          molecule.substring(0, i) + r + molecule.substring(i + m.length),
        );
      }
    }
  }

  return newMolecules;
};

const contract = (molecule) => {
  let mol = molecule;
  let numReplacements = 0;
  while (mol !== 'e') {
    for (const [r, m] of possibles) {
      if (mol.includes(m)) {
        mol = mol.replace(m, r);
        numReplacements++;
      }
    }
  }
  return numReplacements;
};

const part1 = () => expand(target).size;

const part2 = () => contract(target);

console.log('part1', part1());
console.log('part2', part2());