import readInput from '../utils/readInput.js';
import { sum } from '../utils/reducers.js';
import { strToIntArray } from '../utils/functions.js';

const input = readInput();
const buyers = strToIntArray(input);
const sequences = {};

const mix = (value, secret) => (value ^ secret) >>> 0;
const prune = (secret) => secret % 16777216;

const makeNextSecret = (secret) => {
  let nextSecret = prune(mix(secret, secret << 6));
  nextSecret = prune(mix(nextSecret, nextSecret >> 5));
  return prune(mix(nextSecret, nextSecret << 11));
};

export const part1 = () =>
  buyers
    .map((secret) => {
      let nextSecret = secret;
      for (let i = 0; i < 2000; i++) {
        nextSecret = makeNextSecret(nextSecret);
      }
      return nextSecret;
    })
    .reduce(sum);

export const part2 = () => {
  buyers.forEach((secret) => {
    let nextSecret = secret;
    const sequence = [];
    const alreadySeenSequence = {};
    for (let i = 0; i < 2000; i++) {
      const prevNumBananas = nextSecret % 10;
      nextSecret = makeNextSecret(nextSecret);
      const numBananas = nextSecret % 10;
      sequence.push(numBananas - prevNumBananas);
      if (i >= 3) {
        const key = sequence.slice(-4).join(',');
        if (alreadySeenSequence[key]) continue;
        alreadySeenSequence[key] = true;
        if (!sequences[key]) sequences[key] = 0;
        sequences[key] += numBananas;
      }
    }
  });
  return Math.max(...Object.values(sequences));
};
