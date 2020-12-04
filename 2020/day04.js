const fs = require('fs');
const path = require('path');

const input = fs
  .readFileSync(path.resolve(__dirname, 'input04.txt'), 'utf8')
  .split('\n\n')
  .map((p) => p.replace(/\n/g, ' '));

const isNumberBetween = (str, min, max) => {
  const num = parseInt(str, 10);
  return num >= min && num <= max;
};

const isValidField = (field, value) =>
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
  }[field](value));

const containsRequiredFields = (passport) =>
  passport.includes('byr:') &&
  passport.includes('iyr:') &&
  passport.includes('eyr:') &&
  passport.includes('hgt:') &&
  passport.includes('hcl:') &&
  passport.includes('ecl:') &&
  passport.includes('pid:');

const hasValidFields = (passport) =>
  passport
    .split(' ')
    .map((field) => field.split(':'))
    .every((fieldAndValue) => isValidField(...fieldAndValue));

const part1 = () => input.filter(containsRequiredFields).length;
const part2 = () =>
  input.filter(containsRequiredFields).filter(hasValidFields).length;

console.log('part1', part1());
console.log('part2', part2());
