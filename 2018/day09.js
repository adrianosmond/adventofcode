const input = require('./input09'); // Integer

class Marble {
  constructor(number, prev = null, next = null) {
    this.number = number;
    this.prev = prev !== null ? prev : this;
    this.next = next !== null ? next : this;
  }
}

class Circle {
  constructor() {
    this.currentMarble = new Marble(0);
  }

  addMarble(number) {
    const marble = new Marble(
      number,
      this.currentMarble.prev,
      this.currentMarble,
    );
    this.currentMarble.prev.next = marble;
    this.currentMarble.prev = marble;
    this.currentMarble = marble;
  }

  removeMarble() {
    this.currentMarble.prev.next = this.currentMarble.next;
    this.currentMarble.next.prev = this.currentMarble.prev;
    this.currentMarble = this.currentMarble.next;
  }

  goClockwise(times) {
    for (let i = 0; i < times; i++) {
      this.currentMarble = this.currentMarble.next;
    }
  }

  goAnticlockwise(times) {
    for (let i = 0; i < times; i++) {
      this.currentMarble = this.currentMarble.prev;
    }
  }
}

const game = (highestMarble) => {
  let currentPlayer = 1;
  let nextMarble = 1;
  const numPlayers = 462;
  const scores = Array(numPlayers).fill(0);
  const circle = new Circle();

  while (nextMarble <= highestMarble) {
    if (nextMarble % 23 === 0) {
      scores[currentPlayer] += nextMarble;
      circle.goAnticlockwise(7);
      scores[currentPlayer] += circle.currentMarble.number;
      circle.removeMarble();
    } else {
      circle.goClockwise(2);
      circle.addMarble(nextMarble);
    }
    currentPlayer++;
    currentPlayer %= numPlayers;
    nextMarble++;
  }
  return Math.max(...scores);
};

console.log('part1:', game(input));
console.log('part2:', game(input * 100));
