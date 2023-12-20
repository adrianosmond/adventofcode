import readInput from '../utils/readInput.js';

const input = readInput();

const passports = input
  .split('\n\n')
  .map((p) => p.split(/[\s]/g).map((f) => f.split(':')));

const isNumberBetween = (str, min, max) => {
  const num = parseInt(str, 10);
  return num >= min && num <= max;
};

const isValidField = ([field, value]) =>
  ({
    byr: (val) => isNumberBetween(val, 1920, 2002),
    iyr: (val) => isNumberBetween(val, 2010, 2020),
    eyr: (val) => isNumberBetween(val, 2020, 2030),
    hgt: (val) =>
      (val.endsWith('cm') && isNumberBetween(val.substr(0, 3), 150, 193)) ||
      (val.endsWith('in') && isNumberBetween(val.substr(0, 2), 59, 76)),
    hcl: (val) => val.match('^#[a-z0-9]{6}$'),
    ecl: (val) =>
      ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(val),
    pid: (val) => val.match('^[0-9]{9}$'),
    cid: () => true,
  })[field](value);

const hasRequiredFields = (passport) =>
  ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'].every((requiredField) =>
    passport.map(([field]) => field).includes(requiredField),
  );

const hasValidFields = (passport) => passport.every(isValidField);

export const part1 = () => passports.filter(hasRequiredFields).length;

export const part2 = () =>
  passports.filter(hasRequiredFields).filter(hasValidFields).length;
