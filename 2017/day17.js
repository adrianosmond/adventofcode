const numMoves = require('./input17');

class Item {
  constructor(number, prev = null, next = null) {
    this.number = number;
    this.prev = prev !== null ? prev : this;
    this.next = next !== null ? next : this;
  }
}

class Circle {
  constructor() {
    this.currentItem = new Item(0);
    this.firstItem = this.currentItem;
  }

  addItem(number) {
    const item = new Item(number, this.currentItem.prev, this.currentItem);
    this.currentItem.prev.next = item;
    this.currentItem.prev = item;
    this.currentItem = item;
  }

  removeItem() {
    this.currentItem.prev.next = this.currentItem.next;
    this.currentItem.next.prev = this.currentItem.prev;
    this.currentItem = this.currentItem.next;
  }

  goClockwise(times) {
    for (let i = 0; i < times; i++) {
      this.currentItem = this.currentItem.next;
    }
  }

  goAnticlockwise(times) {
    for (let i = 0; i < times; i++) {
      this.currentItem = this.currentItem.prev;
    }
  }
}

const circle = new Circle();

for (let i = 1; i < 2018; i++) {
  circle.goClockwise(numMoves + 1);
  circle.addItem(i);
}

console.log('part1:', circle.currentItem.next.number);

let val = 1;
let idx = 1;
for (let i = 2; i <= 50000000; i++) {
  idx += numMoves;
  idx %= i;
  if (idx === 0) {
    val = i;
  }
  idx++;
}

console.log('part2:', val);
