import readInput from '../utils/readInput.ts';

const input = readInput();

const messages = input.split('\n');

const highestValueKey = (
  best: { best: number; key?: string },
  [key, val]: [string, number],
) => (val > best.best ? { best: val, key } : best);

const lowestValueKey = (
  best: { best: number; key?: string },
  [key, val]: [string, number],
) => (val < best.best ? { best: val, key } : best);

const freq: Array<Record<string, number>> = new Array(messages[0].length)
  .fill(null)
  .map(() => ({}));
messages.forEach((message) => {
  message.split('').forEach((letter, idx) => {
    if (!freq[idx]) freq[idx] = {};
    if (!freq[idx][letter]) freq[idx][letter] = 0;
    freq[idx][letter]++;
  });
});

export const part1 = () =>
  freq
    .map((f) => Object.entries(f).reduce(highestValueKey, { best: 0 }))
    .map((f) => f.key)
    .join('');

export const part2 = () =>
  freq
    .map((f) =>
      Object.entries(f).reduce(lowestValueKey, { best: messages.length }),
    )
    .map((f) => f.key)
    .join('');
