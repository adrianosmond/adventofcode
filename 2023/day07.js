import readInput from '../utils/readInput.js';
import { splitAndMapInputLines } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();

const HAND_VALUES = {
  HIGH: 1,
  PAIR: 2,
  TWO_PAIR: 3,
  THREE: 4,
  FULL_HOUSE: 5,
  FOUR: 6,
  FIVE: 7,
};

const CARD_VALUES = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
};

const P2_CARD_VALUES = {
  ...CARD_VALUES,
  J: 1,
};

const getScore = (counts) => {
  const countValues = Object.values(counts);
  // if there's only 1 card type, we have 5 of a kind
  if (countValues.length === 1) return HAND_VALUES.FIVE;
  // if there's 4 card types, we have a pair
  if (countValues.length === 4) return HAND_VALUES.PAIR;
  // if there's only 5 different card types, we have a high card
  if (countValues.length === 5) return HAND_VALUES.HIGH;
  // if we have 4 of any individual card, we have 4 of a kind
  if (countValues.includes(4)) return HAND_VALUES.FOUR;
  // There are 2 possibilities if we have 3 of one card
  if (countValues.includes(3)) {
    // If it's 3 and 2 it's a full house
    if (countValues.includes(2)) {
      return HAND_VALUES.FULL_HOUSE;
    }
    // Otherwise it's 3 of a kind
    return HAND_VALUES.THREE;
  }
  // The only remaining hand is 2 pair
  return HAND_VALUES.TWO_PAIR;
};

const getCardCounts = (cards, p2 = false) => {
  const counts = {};
  cards.forEach((card) => {
    counts[card] = counts[card] ? counts[card] + 1 : 1;
  });

  if (p2 && counts[1] > 0) {
    const numJokers = counts[1];
    delete counts[1];
    let highestCount = -1;
    let mostCommonCard = -1;
    Object.entries(counts).forEach(([card, count]) => {
      if (count > highestCount) {
        highestCount = count;
        mostCommonCard = card;
      }
    });
    counts[mostCommonCard] += numJokers;
  }

  return counts;
};

const processHand = (hand, p2 = false) => {
  const cards = hand
    .split('')
    .map((card) => (p2 ? P2_CARD_VALUES[card] : CARD_VALUES[card]));

  const counts = getCardCounts(cards, p2);
  const score = getScore(counts);

  return {
    cards,
    counts,
    score,
  };
};

const sortByHandValue = ([a], [b]) => {
  if (a.score === b.score) {
    for (let i = 0; i < a.cards.length; i++) {
      if (a.cards[i] !== b.cards[i]) return a.cards[i] - b.cards[i];
    }
  }

  return a.score - b.score;
};

const hands = splitAndMapInputLines(input).map(([hand, bid]) => [
  hand,
  parseInt(bid, 10),
]);

const part1 = () =>
  hands
    .map(([hand, bid]) => [processHand(hand), bid])
    .sort(sortByHandValue)
    .map(([, bid], idx) => bid * (idx + 1))
    .reduce(sum);

const part2 = () =>
  hands
    .map(([hand, bid]) => [processHand(hand, true), bid])
    .sort(sortByHandValue)
    .map(([, bid], idx) => bid * (idx + 1))
    .reduce(sum);

console.log('part1', part1());
console.log('part2', part2());
