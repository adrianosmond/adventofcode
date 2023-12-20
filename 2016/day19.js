import readInput from '../utils/readInput.js';

const input = readInput();
const numElves = parseInt(input, 10);

const makeCircle = () => {
  const elves = {};

  for (let i = 0; i < numElves; i++) {
    elves[i] = {
      next: null,
      prev: null,
      position: i,
    };
  }
  for (let i = 0; i < numElves; i++) {
    elves[i].next = elves[(i + 1) % numElves];
    elves[i].prev = elves[(i + numElves - 1) % numElves];
  }

  return elves;
};

const eliminateElf = (toEliminate) => {
  toEliminate.next.prev = toEliminate.prev;
  toEliminate.prev.next = toEliminate.next;
};

const part1 = () => {
  const elves = makeCircle();
  let activeElf = elves[0];
  for (let numLeft = numElves; numLeft > 1; numLeft--) {
    eliminateElf(activeElf.next);
    activeElf = activeElf.next;
  }
  return activeElf.position + 1;
};

const part2 = () => {
  let wonByP1 = 1;
  while (wonByP1 < numElves) {
    wonByP1 *= 3;
  }
  wonByP1 /= 3;
  const remainder = numElves - wonByP1;
  if (remainder < wonByP1) {
    return remainder;
  }
  return remainder + (remainder - wonByP1);
};

console.log('part1', part1());
console.log('part2', part2());
