const fs = require('fs');
const path = require('path');
const { mergeObjects } = require('../utils/reducers');

const input = fs.readFileSync(path.resolve(__dirname, 'input07.txt'), 'utf8');

const rules = input.split('\n');
const ruleEntries = rules.map((rule) => {
  const [color, contents] = rule.split(' bags contain ');
  return [
    color,
    {
      hasPath: false,
      contents:
        contents === 'no other bags.'
          ? {}
          : contents
              .split(', ')
              .map((innerBags) => {
                const [, num, bagColor] = innerBags
                  .replace(/\sbag[s]?\.?/, '')
                  .match(/(\d) ([a-z\s]+)/);

                return {
                  [bagColor]: parseInt(num, 10),
                };
              })
              .reduce(mergeObjects),
    },
  ];
});
const ruleTree = Object.fromEntries(ruleEntries);
const bagColor = 'shiny gold';

const findContaining = (target) =>
  ruleEntries
    .filter(([, contents]) => contents.contents[target])
    .map(([key]) => key)
    .flat();

const getNumberOfBags = (target, count) =>
  count +
  count *
    Object.entries(ruleTree[target].contents).reduce((total, [key, number]) => {
      return total + getNumberOfBags(key, number);
    }, 0);

const part1 = () => {
  const toProcess = new Set(findContaining(bagColor));
  const processed = new Set([bagColor]);

  for (const key of toProcess.keys()) {
    processed.add(key);

    findContaining(key)
      .filter((newKey) => !processed.has(newKey) && !toProcess.has(newKey))
      .forEach((newKey) => toProcess.add(newKey));

    toProcess.delete(key);
  }

  return processed.size - 1;
};

const part2 = () => getNumberOfBags(bagColor, 1) - 1;

console.log('part1', part1());
console.log('part2', part2());
