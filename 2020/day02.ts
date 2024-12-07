import readInput from '../utils/readInput.ts';

const input = readInput();

const passwords: [number, number, string, string][] = input
  .split('\n')
  .map((str) => {
    const [, num1, num2, letter, password] = str.match(
      /(\d+)-(\d+) ([a-z]): ([a-z]+)/,
    )!;
    return [parseInt(num1, 10), parseInt(num2, 10), letter, password];
  });

const isValidPassword = (
  min: number,
  max: number,
  letter: string,
  password: string,
) => {
  const letterCount =
    password.length - password.replace(new RegExp(letter, 'g'), '').length;

  return letterCount >= min && letterCount <= max;
};

const isValidPassword2 = (
  pos1: number,
  pos2: number,
  letter: string,
  password: string,
) => (password[pos1 - 1] === letter) !== (password[pos2 - 1] === letter);

export const part1 = () =>
  passwords.reduce(
    (total, pass) => total + (isValidPassword(...pass) ? 1 : 0),
    0,
  );

export const part2 = () =>
  passwords.reduce(
    (total, pass) => total + (isValidPassword2(...pass) ? 1 : 0),
    0,
  );
