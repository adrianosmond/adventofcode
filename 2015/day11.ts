import readInput from '../utils/readInput.ts';

const input = readInput();
const validLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
const lettersToNumbers: Record<string, number> = Object.fromEntries(
  validLetters.map((c, i) => [c, i]),
);
const numbersToLetters: Record<number, string> = Object.fromEntries(
  validLetters.map((c, i) => [i, c]),
);
const invalidChars = ['i', 'l', 'o'];
const nextValid: Record<string, string> = Object.fromEntries(
  invalidChars.map((k) => [k, numbersToLetters[lettersToNumbers[k] + 1]]),
);
Object.keys(nextValid).forEach((k) => delete lettersToNumbers[k]);

const sanitisePassword = (password: string): string => {
  const chars = password.split('');
  let foundBadChar = false;
  for (let i = 0; i < chars.length; i++) {
    if (foundBadChar) {
      chars[i] = 'a';
    } else if (nextValid[chars[i]]) {
      chars[i] = nextValid[chars[i]];
      foundBadChar = true;
    }
  }
  return chars.join('');
};

const isValidPassword = (password: number[]): boolean => {
  let foundRun = false;
  let doubles = 0;
  let prevChar = password[0];
  for (let i = 1; i < password.length; i++) {
    if (prevChar === password[i]) {
      doubles++;
      prevChar = -1;
    } else {
      prevChar = password[i];
    }

    if (
      i > 1 &&
      password[i - 2] === password[i - 1] - 1 &&
      password[i - 1] === password[i] - 1
    ) {
      foundRun = true;
    }
    if (doubles >= 2 && foundRun) {
      return true;
    }
  }
  return false;
};

const getNextPassword = (password: number[]): number[] | undefined => {
  for (let i = password.length - 1; i >= 0; i--) {
    password[i]++;
    if (!numbersToLetters[password[i]]) {
      password[i] = 0;
    } else {
      return password;
    }
  }
};

const toNumeric = (password: string): number[] =>
  password.split('').map((c) => lettersToNumbers[c]);

const toString = (password: number[]): string =>
  password.map((n) => numbersToLetters[n]).join('');

const getNextValidPassword = (password: string): string => {
  const numericPassword = toNumeric(password);
  let nextPassword = getNextPassword(numericPassword);
  while (nextPassword && !isValidPassword(nextPassword)) {
    nextPassword = getNextPassword(numericPassword);
  }
  if (!nextPassword) throw new Error('No valid password found');
  return toString(nextPassword);
};

let answer1: string;

export const part1 = () => {
  answer1 = getNextValidPassword(sanitisePassword(input));
  return answer1;
};

export const part2 = () => getNextValidPassword(answer1);
