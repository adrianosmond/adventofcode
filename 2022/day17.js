import { readInput } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();

const CHAMBER_WIDTH = 7;
// The rocks are flipped upside-down because the floor will be array index 0
// so they should also have their lowest part in the lowest array index
const ROCKS = [
  ['####'],
  [' # ', '###', ' # '],
  ['###', '  #', '  #'],
  ['#', '#', '#', '#'],
  ['##', '##'],
];
// Eventually the differences in height are going to form a repeating sequence
// We want to drop enough rocks to find that sequence, which may be more than
// the 2022 needed for part 1
const NUM_ROCKS_FOR_SEQUENCE = 4000;
const heightDiffs = new Array(NUM_ROCKS_FOR_SEQUENCE);

const spaceToMove = (chamber, rock, left, bottom) => {
  for (let row = 0; row < rock.length; row++) {
    for (let col = 0; col < rock[row].length; col++) {
      if (chamber[bottom + row][left + col] === '#' && rock[row][col] === '#') {
        return false;
      }
    }
  }
  return true;
};

const dropRocks = () => {
  const chamber = new Array(10 + NUM_ROCKS_FOR_SEQUENCE * 2)
    .fill(0)
    .map(() => new Array(CHAMBER_WIDTH).fill(' '));
  let highest = 0;
  let steps = 0;

  for (let i = 0; i < NUM_ROCKS_FOR_SEQUENCE; i++) {
    const rock = ROCKS[i % ROCKS.length];
    let left = 2;
    let bottom = highest + 3;

    while (true) {
      const direction = input[steps % input.length];
      steps++;

      if (
        direction === '<' &&
        left > 0 &&
        spaceToMove(chamber, rock, left - 1, bottom)
      ) {
        left--;
      }

      if (
        direction === '>' &&
        left + rock[0].length < CHAMBER_WIDTH &&
        spaceToMove(chamber, rock, left + 1, bottom)
      ) {
        left++;
      }

      if (bottom > 0 && spaceToMove(chamber, rock, left, bottom - 1)) {
        bottom--;
      } else {
        const next = Math.max(highest, bottom + rock.length);
        heightDiffs[i] = next - highest;
        highest = next;
        break;
      }
    }

    for (let row = 0; row < rock.length; row++) {
      for (let col = 0; col < rock[row].length; col++) {
        if (rock[row][col] === '#') {
          chamber[bottom + row][left + col] = rock[row][col];
        }
      }
    }
  }
};

const getRepeatingSequenceLength = () => {
  for (let length = 5; length < NUM_ROCKS_FOR_SEQUENCE / 2; length++) {
    let found = true;
    for (let i = 1; i <= length; i++) {
      const checkIdx = heightDiffs.length - i;
      if (heightDiffs[checkIdx] !== heightDiffs[checkIdx - length]) {
        found = false;
        break;
      }
    }
    if (found) return length;
  }
  return -1;
};

const getRepeatingSequenceStart = (sequenceLength) => {
  for (let start = 0; start < NUM_ROCKS_FOR_SEQUENCE; start++) {
    let found = true;
    for (let i = 0; i < sequenceLength; i++) {
      const checkIdx = start + i;
      if (heightDiffs[checkIdx] !== heightDiffs[checkIdx + sequenceLength]) {
        found = false;
        break;
      }
    }
    if (found) return start;
  }
  return -1;
};

const part1 = () => {
  dropRocks();
  return heightDiffs.slice(0, 2022).reduce(sum);
};

const part2 = () => {
  const length = getRepeatingSequenceLength();
  const start = getRepeatingSequenceStart(length);

  const numRepeatingRocks = 1000000000000 - start;
  const repeats = Math.floor(numRepeatingRocks / length);
  const remainder = numRepeatingRocks % length;

  return (
    // The sum of the height differences before the repeating sequence begins
    heightDiffs.slice(0, start).reduce(sum) +
    // The sum of the height differences in the repeating section multiplied by the number of times it repeats
    repeats * heightDiffs.slice(start, start + length).reduce(sum) +
    // The sum of the height differences in the incomplete bit of the repeating section at the end
    heightDiffs.slice(start, start + remainder).reduce(sum, 0)
  );
};

console.log('part1', part1());
console.log('part2', part2());
