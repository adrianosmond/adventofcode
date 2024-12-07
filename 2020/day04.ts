import readInput from '../utils/readInput.ts';

const input = readInput();

type PassportField = keyof typeof passportCheck;
type PassportPair = [PassportField, string];
type Passport = PassportPair[];

const passports: Passport[] = input
  .split('\n\n')
  .map((p) => p.split(/[\s]/g).map((f) => f.split(':') as PassportPair));

const isNumberBetween = (str: string, min: number, max: number) => {
  const num = parseInt(str, 10);
  return num >= min && num <= max;
};

const passportCheck = {
  byr: (val: string) => isNumberBetween(val, 1920, 2002),
  iyr: (val: string) => isNumberBetween(val, 2010, 2020),
  eyr: (val: string) => isNumberBetween(val, 2020, 2030),
  hgt: (val: string) =>
    (val.endsWith('cm') && isNumberBetween(val.substr(0, 3), 150, 193)) ||
    (val.endsWith('in') && isNumberBetween(val.substr(0, 2), 59, 76)),
  hcl: (val: string) => val.match('^#[a-z0-9]{6}$'),
  ecl: (val: string) =>
    ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(val),
  pid: (val: string) => val.match('^[0-9]{9}$'),
  cid: () => true,
} as const;

const isValidField = ([field, value]: PassportPair) =>
  passportCheck[field](value);

const hasRequiredFields = (passport: Passport) =>
  ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'].every((requiredField) =>
    passport.map(([field]) => field).includes(requiredField as PassportField),
  );

const hasValidFields = (passport: Passport) => passport.every(isValidField);

export const part1 = () => passports.filter(hasRequiredFields).length;

export const part2 = () =>
  passports.filter(hasRequiredFields).filter(hasValidFields).length;
