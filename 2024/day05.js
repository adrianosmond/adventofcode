import readInput from '../utils/readInput.js';
import { multilineStrToIntArrays } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();

const [ordering, updates] = input.split('\n\n');
const rules = multilineStrToIntArrays(ordering, '|');
const printRuns = multilineStrToIntArrays(updates, ',');

const makePageOrder = (pagesToPrint) => {
  // remove all rules that involve pages not being printed
  let unhandledRules = rules.filter(
    ([p1, p2]) =>
      pagesToPrint.indexOf(p1) >= 0 && pagesToPrint.indexOf(p2) >= 0,
  );
  const orderedPages = [];
  while (orderedPages.length < pagesToPrint.length) {
    const unplacedPages = pagesToPrint.filter(
      (p) => orderedPages.indexOf(p) < 0,
    );
    // find the page that's never on the RHS of an ordering rule
    const nextDigit = unplacedPages.find((p) =>
      unhandledRules.every(([, p2]) => p !== p2),
    );
    orderedPages.push(nextDigit);
    // remove all rules involving the page we just handled
    unhandledRules = unhandledRules.filter((rule) => !rule.includes(nextDigit));
  }
  return orderedPages;
};

const isInOrder = (pagesToPrint) =>
  rules.every(([p1, p2]) => {
    const p1Idx = pagesToPrint.indexOf(p1);
    const p2Idx = pagesToPrint.indexOf(p2);
    if (p1Idx < 0 || p2Idx < 0) return true;
    return p1Idx < p2Idx;
  });

const pickMiddlePage = (pagesToPrint) =>
  pagesToPrint[Math.floor(pagesToPrint.length / 2)];

export const part1 = () =>
  printRuns.filter(isInOrder).map(pickMiddlePage).reduce(sum);

export const part2 = () =>
  printRuns
    .filter((update) => !isInOrder(update))
    .map(makePageOrder)
    .map(pickMiddlePage)
    .reduce(sum);
