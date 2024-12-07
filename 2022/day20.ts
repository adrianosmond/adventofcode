import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';
import { sum } from '../utils/reducers.ts';

class Item {
  number: number;
  prev: Item;
  next: Item;

  constructor(number: number) {
    this.number = number;
    this.prev = this;
    this.next = this;
  }
}

const input = readInput();
const numbers = strToIntArray(input);

const setupItems = (items: Item[]) => {
  for (let i = 0; i < items.length; i++) {
    items[i].prev = items.at(i - 1)!;
    items[i].next = items.at((i + 1) % items.length)!;
  }
};

const doMix = (items: Item[], numRounds = 1) => {
  for (let round = 0; round < numRounds; round++) {
    items.forEach((item) => {
      if (item.number === 0 || Math.abs(item.number) % (items.length - 1) === 0)
        return;

      let target = item;
      const repeats =
        (item.number + 811589153 * 2 * (items.length - 1)) % (items.length - 1);

      for (let i = 0; i < repeats; i++) {
        target = target.next;
      }

      const prev = item.prev;
      const next = item.next;
      prev.next = next;
      next.prev = prev;
      item.prev = target;
      item.next = target.next;
      target.next.prev = item;
      target.next = item;
    });
  }
};

const getGrooveCoordinates = (multiplier = 1, numRounds = 1) => {
  const items = numbers.map((n) => new Item(n * multiplier));
  setupItems(items);
  doMix(items, numRounds);

  const coords = [];
  let pointer = items.find((i) => i.number === 0)!;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 1000; j++) {
      pointer = pointer.next;
    }
    coords.push(pointer.number);
  }

  return coords.reduce(sum);
};

export const part1 = () => getGrooveCoordinates();

export const part2 = () => getGrooveCoordinates(811589153, 10);
