import { readInput } from '../utils/functions.js';
import { mergeObjects } from '../utils/reducers.js';

const input = readInput();

const rules = input.split('\n');

const contentsToObject = (bags) => {
  if (bags === 'no other bags.') {
    return {};
  }

  const [, num, bagColor] = bags
    .replace(/\sbag[s]?\.?/, '')
    .match(/(\d) ([a-z\s]+)/);

  return {
    [bagColor]: parseInt(num, 10),
  };
};

const ruleEntries = rules.map((rule) => {
  const [color, contents] = rule.split(' bags contain ');
  return [
    color,
    contents.split(', ').map(contentsToObject).reduce(mergeObjects),
  ];
});

const ruleTree = Object.fromEntries(ruleEntries);

const findContaining = (target) =>
  ruleEntries
    .filter(([, contents]) => contents[target])
    .map(([key]) => key)
    .flat();

const getNumberOfBags = (target, count) =>
  count +
  count *
    Object.entries(ruleTree[target]).reduce(
      (total, [key, number]) => total + getNumberOfBags(key, number),
      0,
    );

const part1 = () => {
  const containingBagColor = new Set(findContaining('shiny gold'));

  for (const key of containingBagColor.keys()) {
    findContaining(key).forEach((newKey) => containingBagColor.add(newKey));
  }

  return containingBagColor.size;
};

const part2 = () => getNumberOfBags('shiny gold', 1) - 1;

console.log('part1', part1());
console.log('part2', part2());
