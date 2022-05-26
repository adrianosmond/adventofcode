import { readInput } from '../utils/functions.js';

const input = readInput();

const getDiscs = () =>
  input.split('\n').map((line) => {
    const [, total, start] = line.match(
      /Disc #\d has ([0-9]+) positions; at time=0, it is at position ([0-9]+)./,
    );
    return [parseInt(total, 10), parseInt(start, 10)];
  });

const findBestTime = (discs) => {
  let time = discs[0][0] - discs[0][1] - 1;
  while (true) {
    let works = true;
    for (let i = 0; works && i < discs.length; i += 1) {
      if ((discs[i][1] + time + i + 1) % discs[i][0] !== 0) {
        works = false;
      }
    }
    if (works) {
      return time;
    }
    time += discs[0][0];
  }
};

const part1 = () => findBestTime(getDiscs());

const part2 = () => findBestTime([...getDiscs(), [11, 0]]);

console.log('part1', part1());
console.log('part2', part2());
