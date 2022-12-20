import { readInput, strToIntArray } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

class Item {
  constructor(number) {
    this.number = number;
    this.prev = null;
    this.next = null;
  }
}

const input = readInput();
const numbers = strToIntArray(input);

const setupItems = (items) => {
  for (let i = 0; i < items.length; i++) {
    items[i].prev = items.at(i - 1);
    items[i].next = items.at((i + 1) % items.length);
  }
};

const doMix = (items, numRounds = 1) => {
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
  let pointer = items.find((i) => i.number === 0);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 1000; j++) {
      pointer = pointer.next;
    }
    coords.push(pointer.number);
  }

  return coords.reduce(sum);
};

const part1 = () => getGrooveCoordinates();

const part2 = () => getGrooveCoordinates(811589153, 10);

console.log('part1', part1());
console.log('part2', part2());
