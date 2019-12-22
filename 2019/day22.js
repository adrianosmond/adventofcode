/* global BigInt */
const input = require('./input22');

const getInstruction = i => {
  if (i.includes('increment')) {
    const inc = parseInt(i.substring(20), 10);
    return ['increment', inc];
  }
  if (i.includes('new')) {
    return ['reverse'];
  }
  if (i.startsWith('cut')) {
    const cut = parseInt(i.substring(4), 10);
    return ['cut', cut];
  }
  throw new Error('Invalid instruction');
};

const instructions = input.split('\n').map(i => getInstruction(i));

const getActions = numCards => ({
  increment: (decks, currentDeck, nextDeck, n) => {
    const next = decks[nextDeck];
    const current = decks[currentDeck];
    for (let i = 0; i < numCards; i++) {
      next[(i * n) % numCards] = current[i];
    }
  },
  cut: (decks, currentDeck, nextDeck, n) => {
    const next = decks[nextDeck];
    const current = decks[currentDeck];
    const toCut = (numCards + n) % numCards;
    for (let i = 0; i < numCards; i++) {
      next[i] = current[(i + toCut) % numCards];
    }
  },
  reverse: (decks, currentDeck, nextDeck) => {
    const next = decks[nextDeck];
    const current = decks[currentDeck];
    for (let i = 0; i < numCards; i++) {
      next[i] = current[numCards - (i + 1)];
    }
  },
});

const doShuffle = numCards => {
  const actions = getActions(numCards);
  const decks = new Array(2)
    .fill()
    .map(() => new Array(numCards).fill().map((_, i) => i));

  instructions.forEach(([action, param], idx) => {
    actions[action](decks, idx % 2, (idx + 1) % 2, param);
  });

  return decks[instructions.length % 2];
};

const day22part1 = () => {
  const numCards = 10007;
  const deck = doShuffle(numCards);
  return deck.indexOf(2019);
};

const mod = (n, m) => ((n % m) + m) % m;

const modularPow = (b, e, modulus) => {
  if (modulus === 1) {
    return 0;
  }
  let base = b;
  let exponent = e;
  let result = 1n;
  base %= modulus;
  while (exponent > 0) {
    if (exponent % 2n === 1n) {
      result = mod(result * base, modulus);
    }
    exponent >>= 1n;
    base = mod(base * base, modulus);
  }
  return result;
};

const getCardAtPos = (pos, offset, increment, modulo) =>
  mod(offset + pos * increment, modulo);

const reduceInstructions = numCards => {
  let offset = 0n;
  let increment = 1n;
  instructions.forEach(([action, n]) => {
    if (action === 'reverse') {
      increment *= -1n;
      increment = mod(increment, numCards);
      offset += increment;
      offset = mod(offset, numCards);
    } else if (action === 'cut') {
      offset += increment * mod(BigInt(n), numCards);
      offset = mod(offset, numCards);
    } else if (action === 'increment') {
      increment *= modularPow(BigInt(n), numCards - 2n, numCards);
      increment = mod(increment, numCards);
    }
  });
  return [increment, offset];
};

const getResultAfterManyShuffles = (numCards, numShuffles, i1, o1) => {
  const increment = modularPow(i1, numShuffles, numCards);
  let offset = o1 * (1n - modularPow(i1, numShuffles, numCards));
  const inv = mod(1n - i1, numCards);
  offset *= modularPow(inv, numCards - 2n, numCards);
  offset = mod(offset, numCards);
  return [increment, offset];
};

const day22part2 = () => {
  const numCards = 119315717514047n;
  const numShuffles = 101741582076661n;
  const [i1, o1] = reduceInstructions(numCards);
  const [increment, offset] = getResultAfterManyShuffles(
    numCards,
    numShuffles,
    i1,
    o1,
  );
  return Number(getCardAtPos(2020n, offset, increment, numCards));
};

console.log('part1:', day22part1());
console.log('part2:', day22part2());
