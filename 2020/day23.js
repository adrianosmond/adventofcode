import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';

const input = readInput();
const numbers = strToIntArray(input, '');
const min = Math.min(...numbers);
const max = Math.max(...numbers);

const play = (cups, numTurns) => {
  let current = numbers[0];
  const numCups = Object.keys(cups).length;

  for (let i = 0; i < numTurns; i++) {
    let destination = current - 1;
    const first = cups[current].next;
    const second = cups[first].next;
    const third = cups[second].next;
    const fourth = cups[third].next;
    cups[current].next = fourth;

    while (
      destination < min ||
      destination === first ||
      destination === second ||
      destination === third
    ) {
      destination--;
      if (destination < min) {
        destination = numCups;
      }
    }

    const afterDestination = cups[destination].next;
    cups[destination].next = first;
    cups[third].next = afterDestination;
    current = cups[current].next;
  }
};

export const part1 = () => {
  const cups = {};
  numbers.forEach((number, index) => {
    cups[number] = {
      prev: numbers[(index + (numbers.length - 1)) % numbers.length],
      next: numbers[(index + 1) % numbers.length],
    };
  });

  play(cups, 100);

  let answer = '';
  let { next } = cups[1];
  while (next !== 1) {
    answer += next;
    next = cups[next].next;
  }
  return parseInt(answer, 10);
};

export const part2 = () => {
  const start = numbers[0];
  const NUM_CUPS = 1000000;
  const cups = {};
  numbers.forEach((number, index) => {
    cups[number] = {
      prev: numbers[(index + (numbers.length - 1)) % numbers.length],
      next: numbers[(index + 1) % numbers.length],
    };
  });
  for (let i = max + 1; i <= NUM_CUPS; i++) {
    cups[i] = {
      prev: i - 1,
      next: i + 1,
    };
  }
  cups[start].prev = NUM_CUPS;
  cups[numbers[numbers.length - 1]].next = max + 1;
  cups[max + 1].prev = numbers[numbers.length - 1];
  cups[NUM_CUPS].next = start;

  play(cups, 10000000);

  const first = cups[1].next;
  const second = cups[first].next;

  return first * second;
};
