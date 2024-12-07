import readInput from '../utils/readInput.ts';
import { mergeObjects } from '../utils/reducers.ts';

const input = readInput();

const rules = input.split('\n');

const contentsToObject = (bags: string) => {
  if (bags === 'no other bags.') {
    return {};
  }

  const [, num, bagColor] = bags
    .replace(/\sbag[s]?\.?/, '')
    .match(/(\d) ([a-z\s]+)/)!;

  return {
    [bagColor]: parseInt(num, 10),
  };
};

const ruleEntries: [string, Record<string, number>][] = rules.map((rule) => {
  const [color, contents] = rule.split(' bags contain ');
  return [
    color,
    contents.split(', ').map(contentsToObject).reduce(mergeObjects),
  ];
});

const ruleTree: Record<string, Record<string, number>> = Object.fromEntries(
  ruleEntries,
);

const findContaining = (target: string) =>
  ruleEntries
    .filter(([, contents]) => contents[target])
    .map(([key]) => key)
    .flat();

const getNumberOfBags = (target: string, count: number) =>
  count +
  count *
    Object.entries(ruleTree[target]).reduce(
      (total, [key, number]): number => total + getNumberOfBags(key, number),
      0,
    );

export const part1 = () => {
  const containingBagColor = new Set(findContaining('shiny gold'));

  for (const key of containingBagColor.keys()) {
    findContaining(key).forEach((newKey) => containingBagColor.add(newKey));
  }

  return containingBagColor.size;
};

export const part2 = () => getNumberOfBags('shiny gold', 1) - 1;
