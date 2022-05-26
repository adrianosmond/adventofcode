import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input19.txt'), 'utf8');

const [r, m] = input.replace(/"/g, '').split('\n\n');

const messages = m.split('\n');

const solve = (rules) => {
  let mergedRules = `${rules}\n`;
  mergedRules = mergedRules.replace(/\n/g, ' \n');

  while (mergedRules.indexOf('\n') >= 0) {
    const [match, i, str] = mergedRules.match(/(\d+): ([^0-9\n$]+)\n/);
    if (i === '0') break;
    const hasPipe = str.indexOf('|') >= 0;
    while (mergedRules.includes(` ${i} `)) {
      mergedRules = mergedRules.replace(
        new RegExp(` ${i} `, 'g'),
        hasPipe ? ` (${str}) ` : ` ${str} `,
      );
    }
    mergedRules = mergedRules.replace(match.trim(), '');
    mergedRules = mergedRules.replace(/\n\n/g, '\n');
  }
  mergedRules = mergedRules.replace('0: ', '');
  mergedRules = mergedRules.replace(/[\s]/g, '');

  mergedRules = new RegExp(`^${mergedRules}$`);
  return messages.reduce(
    (total, message) => total + (mergedRules.test(message) ? 1 : 0),
    0,
  );
};

const part1 = () => solve(r);

const part2 = () => {
  let rules = r.replace('8: 42', '8: ( 42 )+');
  rules = rules.replace(
    '11: 42 31',
    '11: 42 ( 42 ( 42  ( 42  31 )?  31 )? 31 )?  31',
  );

  return solve(rules);
};

console.log('part1', part1());
console.log('part2', part2());
