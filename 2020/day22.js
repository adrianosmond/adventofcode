const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input22.txt'), 'utf8');

const makeDecks = () =>
  input
    .replace(/Player \d:\n/g, '')
    .split('\n\n')
    .map((deck) => deck.split('\n').map((card) => parseInt(card, 10)));

const score = (decks) => {
  const winningDeck = decks.flat();
  return winningDeck.reduce(
    (total, card, index) => total + card * (winningDeck.length - index),
    0,
  );
};

const combat = (decks, recursive = false) => {
  const states = {};
  const d1 = decks[0];
  const d2 = decks[1];

  while (decks.every((deck) => deck.length > 0)) {
    const key = decks.map((h) => h.join(',')).join(':');
    if (states[key]) {
      return [[1], []];
    }

    states[key] = true;
    const c1 = d1.shift();
    const c2 = d2.shift();

    if (recursive && d1.length >= c1 && d2.length >= c2) {
      const [d1r, d2r] = combat(
        [[...d1.slice(0, c1)], [...d2.slice(0, c2)]],
        true,
      );
      if (d1r.length > d2r.length) {
        d1.push(c1);
        d1.push(c2);
      } else {
        d2.push(c2);
        d2.push(c1);
      }
    } else if (c1 > c2) {
      d1.push(c1);
      d1.push(c2);
    } else {
      d2.push(c2);
      d2.push(c1);
    }
  }

  return decks;
};

const part1 = () => score(combat(makeDecks()));

const part2 = () => score(combat(makeDecks(), true));

console.log('part1', part1());
console.log('part2', part2());
