import readInput from '../utils/readInput.js';
import { sortDesc, strToIntArray } from '../utils/functions.js';
import { product } from '../utils/reducers.js';

const input = readInput();
const getMonkeys = () => {
  let lcm = 1;
  const monkeys = input
    .replace(/Monkey \d+:\n/g, '')
    .replace(/ {2}Starting items: /g, '')
    .replace(/ {2}Operation: new = old /g, '')
    .replace(/ {2}Test: divisible by /g, '')
    .replace(/ {4}If true: throw to monkey /g, '')
    .replace(/ {4}If false: throw to monkey /g, '')
    .split('\n\n')
    .map((m) => m.split('\n'))
    .map((m) => {
      const items = strToIntArray(m[0], ',');
      const [op, amt] = m[1].split(' ');
      let updateWorry;
      if (amt === 'old') {
        updateWorry = op === '*' ? (val) => val * val : (val) => val + val;
      } else {
        const amount = parseInt(amt, 10);
        updateWorry =
          op === '*' ? (val) => val * amount : (val) => val + amount;
      }
      const testAmount = parseInt(m[2], 10);
      lcm *= testAmount;
      const trueMonkey = parseInt(m[3], 10);
      const falseMonkey = parseInt(m[4], 10);
      const throwTo = (val) =>
        val % testAmount === 0 ? trueMonkey : falseMonkey;

      return {
        items,
        updateWorry,
        throwTo,
        inspections: 0,
      };
    });
  return [monkeys, lcm];
};

const simulateMonkeys = (numRounds, worryModifier = (worry) => worry) => {
  const [monkeys, lcm] = getMonkeys();
  for (let round = 0; round < numRounds; round++) {
    monkeys.forEach((monkey) => {
      const { items, updateWorry, throwTo } = monkey;
      while (items.length > 0) {
        const startingWorry = items.shift();
        const newWorry = worryModifier(updateWorry(startingWorry)) % lcm;
        monkeys[throwTo(newWorry)].items.push(newWorry);
        monkey.inspections++;
      }
    });
  }

  return monkeys
    .map((m) => m.inspections)
    .sort(sortDesc)
    .slice(0, 2)
    .reduce(product);
};

export const part1 = () => simulateMonkeys(20, (w) => Math.floor(w / 3));

export const part2 = () => simulateMonkeys(10000);
