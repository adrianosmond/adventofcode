const input = require('./input02');

const boxes = input.split('\n');
const checksum = boxes
  .map((box) => {
    const letters = {};
    box.split('').forEach((char) => {
      if (letters[char]) {
        letters[char] += 1;
      } else {
        letters[char] = 1;
      }
    });

    return Object.values(letters).reduce(
      (prev, count) => ({
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

const differentCharIndexes = (str1, str2) =>
  str1
    .split('')
    .reduce(
      (prev, curr, idx) => (curr === str2[idx] ? prev : [...prev, idx]),
      [],
    );

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

console.log('part1:', checksum.two * checksum.three);
console.log('part2:', commonLetters);
