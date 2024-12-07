import readInput from '../utils/readInput.ts';

const input = readInput();
const [numPlayers, points] = input.split(/[^0-9]+/).map((n) => parseInt(n, 10));

class Marble {
  number: number;
  prev: Marble;
  next: Marble;
  constructor(
    number: number,
    prev: Marble | null = null,
    next: Marble | null = null,
  ) {
    this.number = number;
    this.prev = prev !== null ? prev : this;
    this.next = next !== null ? next : this;
  }
}

class Circle {
  currentMarble: Marble;
  constructor() {
    this.currentMarble = new Marble(0);
  }

  addMarble(number: number) {
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

  goClockwise(times: number) {
    for (let i = 0; i < times; i++) {
      this.currentMarble = this.currentMarble.next;
    }
  }

  goAnticlockwise(times: number) {
    for (let i = 0; i < times; i++) {
      this.currentMarble = this.currentMarble.prev;
    }
  }
}

const game = (highestMarble: number): number => {
  let currentPlayer = 1;
  let nextMarble = 1;
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

export const part1 = () => game(points);

export const part2 = () => game(points * 100);
