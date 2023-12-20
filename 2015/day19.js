import readInput from '../utils/readInput.js';
import { splitAndMapInputLines } from '../utils/functions.js';

const input = readInput();

const [replacements, target] = input.split('\n\n');
const possibles = splitAndMapInputLines(replacements, ' => ');

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

export const part1 = () => expand(target).size;

export const part2 = () => contract(target);
