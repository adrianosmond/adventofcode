import readInput from '../utils/readInput.ts';

const input = parseInt(readInput(), 10);

class Item {
  number: number;
  prev: Item | null;
  next: Item | null;

  constructor(
    number: number,
    prev: Item | null = null,
    next: Item | null = null,
  ) {
    this.number = number;
    this.prev = prev !== null ? prev : this;
    this.next = next !== null ? next : this;
  }
}

class Circle {
  currentItem;
  firstItem;

  constructor() {
    this.currentItem = new Item(0);
    this.firstItem = this.currentItem;
  }

  addItem(number: number) {
    const item = new Item(number, this.currentItem.prev, this.currentItem);
    this.currentItem.prev!.next = item;
    this.currentItem.prev = item;
    this.currentItem = item;
  }

  removeItem() {
    this.currentItem.prev!.next = this.currentItem.next!;
    this.currentItem.next!.prev = this.currentItem.prev!;
    this.currentItem = this.currentItem.next!;
  }

  goClockwise(times: number) {
    for (let i = 0; i < times; i++) {
      this.currentItem = this.currentItem.next!;
    }
  }

  goAnticlockwise(times: number) {
    for (let i = 0; i < times; i++) {
      this.currentItem = this.currentItem.prev!;
    }
  }
}

export const part1 = () => {
  const circle = new Circle();

  for (let i = 1; i < 2018; i++) {
    circle.goClockwise(input + 1);
    circle.addItem(i);
  }

  return circle.currentItem.next!.number;
};

export const part2 = () => {
  let val = 1;
  let idx = 1;
  for (let i = 2; i <= 50000000; i++) {
    idx += input;
    idx %= i;
    if (idx === 0) {
      val = i;
    }
    idx++;
  }
  return val;
};
