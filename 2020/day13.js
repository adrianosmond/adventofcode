/* eslint-disable no-loop-func */
const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input13.txt'), 'utf8');

const part1 = () => {
  const [now, ...buses] = input
    .replace(/,x/g, '')
    .replace(/,/g, '\n')
    .split('\n')
    .map((n) => parseInt(n, 10));

  let time = now;
  let departing = buses.find((bus) => time % bus === 0);
  while (!departing) {
    time++;
    departing = buses.find((bus) => time % bus === 0);
  }
  return (time - now) * departing;
};

const part2 = () => {
  const [firstBus, ...buses] = input
    .split('\n')[1]
    .split(',')
    .map((n, i) => [parseInt(n, 10), i])
    .filter(([n]) => !Number.isNaN(n));

  let multiplier = firstBus[0];
  let i = 0;

  buses.forEach(([bus, busIndex]) => {
    while (true) {
      if ((i + busIndex) % bus === 0) {
        multiplier *= bus;
        break;
      }
      i += multiplier;
    }
  });

  return i;
};

console.log('part1', part1());
console.log('part2', part2());
