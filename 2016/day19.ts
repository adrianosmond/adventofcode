import readInput from '../utils/readInput.ts';

const input = readInput();
const numElves = parseInt(input, 10);

type Elf = {
  next: Elf | null;
  prev: Elf | null;
  position: number;
};

const makeCircle = (): Record<number, Elf> => {
  const elves: Record<number, Elf> = {};

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

const eliminateElf = (toEliminate: Elf): void => {
  if (!toEliminate.next || !toEliminate.prev)
    throw new Error('Elf has no next or prev');
  toEliminate.next.prev = toEliminate.prev;
  toEliminate.prev.next = toEliminate.next;
};

export const part1 = () => {
  const elves = makeCircle();
  let activeElf = elves[0];
  for (let numLeft = numElves; numLeft > 1; numLeft--) {
    if (!activeElf.next) throw new Error('Active elf has no next');
    eliminateElf(activeElf.next);
    activeElf = activeElf.next;
  }
  return activeElf.position + 1;
};

export const part2 = () => {
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
