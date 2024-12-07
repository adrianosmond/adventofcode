import readInput from '../utils/readInput.ts';

const input = readInput();
const boxes = input.split('\n');

const differentCharIndexes = (str1: string, str2: string): number[] =>
  str1
    .split('')
    .reduce(
      (prev: number[], curr: string, idx: number) =>
        curr === str2[idx] ? prev : [...prev, idx],
      [],
    );

export const part1 = () => {
  const checksum = boxes
    .map((box) => {
      const letters: Record<string, number> = {};
      box.split('').forEach((char: string) => {
        if (letters[char]) letters[char] += 1;
        else letters[char] = 1;
      });

      return Object.values(letters).reduce(
        (prev: { two: boolean; three: boolean }, count: number) => ({
          two: prev.two || count === 2,
          three: prev.three || count === 3,
        }),
        {
          two: false,
          three: false,
        },
      );
    })
    .reduce(
      (prev, curr) => ({
        two: prev.two + (curr.two ? 1 : 0),
        three: prev.three + (curr.three ? 1 : 0),
      }),
      { two: 0, three: 0 },
    );
  return checksum.two * checksum.three;
};

export const part2 = () => {
  let commonLetters;
  for (let i = 0; i < boxes.length && !commonLetters; i++) {
    for (let j = i + 1; j < boxes.length && !commonLetters; j += 1) {
      const diff = differentCharIndexes(boxes[i], boxes[j]);
      if (diff.length === 1) {
        commonLetters = boxes[i]
          .split('')
          .filter((c, idx) => idx !== diff[0])
          .join('');
      }
    }
  }
  return commonLetters;
};
