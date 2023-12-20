import readInput from '../utils/readInput.js';

const input = readInput();
const validLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
const lettersToNumbers = Object.fromEntries(validLetters.map((c, i) => [c, i]));
const numbersToLetters = Object.fromEntries(validLetters.map((c, i) => [i, c]));
const invalidChars = ['i', 'l', 'o'];
const nextValid = Object.fromEntries(
  invalidChars.map((k) => [k, numbersToLetters[lettersToNumbers[k] + 1]]),
);
Object.keys(nextValid).forEach((k) => delete lettersToNumbers[k]);

const sanitisePassword = (password) => {
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

const isValidPassword = (password) => {
  let foundRun = false;
  let doubles = 0;
  let prevChar = password[0];
  for (let i = 1; i < password.length; i++) {
    if (prevChar === password[i]) {
      doubles++;
      prevChar = '';
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

const getNextPassword = (password) => {
  for (let i = password.length - 1; i >= 0; i--) {
    password[i]++;
    if (!numbersToLetters[password[i]]) {
      password[i] = 0;
    } else {
      return password;
    }
  }
};

const getNextValidPassword = (password) => {
  const numericPassword = password.split('').map((c) => lettersToNumbers[c]);
  let nextPassword = getNextPassword(numericPassword);
  while (!isValidPassword(nextPassword)) {
    nextPassword = getNextPassword(numericPassword);
  }
  return nextPassword.map((n) => numbersToLetters[n]).join('');
};

let answer1;

export const part1 = () => {
  answer1 = getNextValidPassword(sanitisePassword(input));
  return answer1;
};

export const part2 = () => getNextValidPassword(answer1);
