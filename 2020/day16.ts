import readInput from '../utils/readInput.ts';
import { multilineStrToIntArrays, strToIntArray } from '../utils/functions.ts';

const input = readInput();

const [r, t, n] = input
  .replace('your ticket:\n', '')
  .replace('nearby tickets:\n', '')
  .split('\n\n');

const rules = r
  .split('\n')
  .map((rule) => rule.match(/[^:]+: (\d+)-(\d+) or (\d+)-(\d+)/)!)
  .map(([, a, b, c, d]) => [
    parseInt(a, 10),
    parseInt(b, 10),
    parseInt(c, 10),
    parseInt(d, 10),
  ]);

const myTicket = strToIntArray(t, ',');
const nearby = multilineStrToIntArrays(n, ',');

const isValid = (number: number, rule: number[]) =>
  (number >= rule[0] && number <= rule[1]) ||
  (number >= rule[2] && number <= rule[3]);

const isValidTicket = (ticket: number[]) => {
  for (let i = 0; i < ticket.length; i++) {
    const number = ticket[i];
    let valid = false;

    for (let j = 0; j < rules.length && !valid; j++) {
      valid = isValid(number, rules[j]);
    }

    if (!valid) {
      return false;
    }
  }
  return true;
};

export const part1 = () => {
  let errorRate = 0;
  nearby.forEach((ticket) => {
    for (let i = 0; i < ticket.length; i++) {
      const number = ticket[i];
      let valid = false;
      for (let j = 0; j < rules.length && !valid; j++) {
        valid = isValid(number, rules[j]);
      }

      if (!valid) {
        errorRate += number;
      }
    }
  });
  return errorRate;
};

export const part2 = () => {
  const tickets = nearby.filter(isValidTicket);
  tickets.push(myTicket);

  const identified: number[] = [];
  const possibilities = new Array(myTicket.length)
    .fill(0)
    .map(() => new Array(myTicket.length).fill(0).map((_, i) => i));

  while (possibilities.some((p) => p.length > 1)) {
    for (let field = 0; field < myTicket.length; field++) {
      if (identified.includes(field)) continue;

      for (let rule = 0; rule < rules.length; rule++) {
        if (!possibilities[field].includes(rule)) continue;

        if (tickets.some((ticket) => !isValid(ticket[field], rules[rule]))) {
          possibilities[field] = possibilities[field].filter((p) => p !== rule);
        }
      }

      if (possibilities[field].length === 1) {
        identified.push(field);
        for (let i = 0; i < possibilities.length; i++) {
          if (i === field) continue;

          possibilities[i] = possibilities[i].filter(
            (p) => p !== possibilities[field][0],
          );
        }
      }
    }
  }

  return possibilities
    .flat()
    .reduce((ans, field, pos) => ans * (field < 6 ? myTicket[pos] : 1), 1);
};
