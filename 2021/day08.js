import readInput from '../utils/readInput.js';

const input = readInput();

const patterns = input.split('\n').map((row) => {
  const [signal, output] = row.split(' | ');
  return [
    signal.split(' ').map((a) => a.split('').sort().join('')),
    output.split(' ').map((a) => a.split('').sort().join('')),
  ];
});

const findDigits = (signal) => {
  const digits = new Array(10);
  // 1 is the only number made of 2 segments
  digits[1] = signal.find((pattern) => pattern.length === 2);
  // 7 is the only number made of 3 segments
  digits[7] = signal.find((pattern) => pattern.length === 3);
  // 4 is the only number made of 4 segments
  digits[4] = signal.find((pattern) => pattern.length === 4);
  // 8 is the only number made of 7 segments
  digits[8] = signal.find((pattern) => pattern.length === 7);

  // Numbers made of 6 segments are: 0, 6, 9
  // 9 is the only number made of 6 segments that completely
  // contains the segments of the number 4
  digits[9] = signal.find(
    (pattern) =>
      pattern.length === 6 &&
      digits[4].split('').every((char) => pattern.includes(char)),
  );

  // 6 is the only number made of 6 segments that doesn't
  // completely contain the segments of the number 7
  digits[6] = signal.find(
    (pattern) =>
      pattern.length === 6 &&
      !digits[7].split('').every((char) => pattern.includes(char)),
  );

  // 0 is the other number made of 6 segments
  digits[0] = signal.find(
    (pattern) =>
      pattern.length === 6 && pattern !== digits[6] && pattern !== digits[9],
  );

  // Numbers made of 5 segments are: 2, 3, 5
  // 3 is the only number made of 5 segments that completely
  // contains the segments of the number 1
  digits[3] = signal.find(
    (pattern) =>
      pattern.length === 5 &&
      digits[1].split('').every((char) => pattern.includes(char)),
  );

  // 5 is the only number made of 5 segments that completely
  // fits inside the segments of the number 6
  digits[5] = signal.find(
    (pattern) =>
      pattern.length === 5 &&
      pattern.split('').every((char) => digits[6].includes(char)),
  );

  // 2 is the other number made of 5 segments
  digits[2] = signal.find(
    (pattern) =>
      pattern.length === 5 && pattern !== digits[5] && pattern !== digits[3],
  );

  return digits;
};

export const part1 = () =>
  patterns.reduce(
    (total, [, output]) =>
      total +
      output.filter((pattern) => [2, 3, 4, 7].includes(pattern.length)).length,
    0,
  );

export const part2 = () =>
  patterns.reduce((total, [signal, output]) => {
    const digits = findDigits(signal);
    return (
      total +
      parseInt(output.map((pattern) => digits.indexOf(pattern)).join(''), 10)
    );
  }, 0);
