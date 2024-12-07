/* global BigInt */
import readInput from '../utils/readInput.ts';

const input = readInput();

type Action = 'increment' | 'reverse' | 'cut';
const getInstruction = (i: string): [Action] | [Action, number] => {
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

const instructions = input.split('\n').map((i) => getInstruction(i));

type ActionFn = (
  decks: number[][],
  currentDeck: number,
  nextDeck: number,
  n?: number,
) => void;

const getActions = (numCards: number): Record<Action, ActionFn> => ({
  increment: (decks, currentDeck, nextDeck, n) => {
    const next = decks[nextDeck];
    const current = decks[currentDeck];
    for (let i = 0; i < numCards; i++) {
      next[(i * n!) % numCards] = current[i];
    }
  },
  cut: (decks, currentDeck, nextDeck, n) => {
    const next = decks[nextDeck];
    const current = decks[currentDeck];
    const toCut = (numCards + n!) % numCards;
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

const doShuffle = (numCards: number) => {
  const actions = getActions(numCards);
  const decks = new Array(2)
    .fill(0)
    .map(() => new Array(numCards).fill(0).map((_, i) => i));

  instructions.forEach(([action, param], idx) => {
    actions[action](decks, idx % 2, (idx + 1) % 2, param);
  });

  return decks[instructions.length % 2];
};

const mod = (n: bigint, m: bigint) => ((n % m) + m) % m;

const modularPow = (b: bigint, e: bigint, modulus: bigint) => {
  if (modulus === 1n) {
    return 0n;
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

const getCardAtPos = (
  pos: bigint,
  offset: bigint,
  increment: bigint,
  modulo: bigint,
) => mod(offset + pos * increment, modulo);

const reduceInstructions = (numCards: bigint) => {
  let offset = 0n;
  let increment = 1n;
  instructions.forEach(([action, n]) => {
    if (action === 'reverse') {
      increment *= -1n;
      increment = mod(increment, numCards);
      offset += increment;
      offset = mod(offset, numCards);
    } else if (action === 'cut') {
      offset += increment * mod(BigInt(n!), numCards);
      offset = mod(offset, numCards);
    } else if (action === 'increment') {
      increment *= modularPow(BigInt(n!), numCards - 2n, numCards);
      increment = mod(increment, numCards);
    }
  });
  return [increment, offset];
};

const getResultAfterManyShuffles = (
  numCards: bigint,
  numShuffles: bigint,
  i1: bigint,
  o1: bigint,
) => {
  const increment = modularPow(i1, numShuffles, numCards);
  let offset = o1 * (1n - modularPow(i1, numShuffles, numCards));
  const inv = mod(1n - i1, numCards);
  offset *= modularPow(inv, numCards - 2n, numCards);
  offset = mod(offset, numCards);
  return [increment, offset];
};

export const part1 = () => {
  const numCards = 10007;
  const deck = doShuffle(numCards);
  return deck.indexOf(2019);
};

export const part2 = () => {
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
