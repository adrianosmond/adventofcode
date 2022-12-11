import { readInput, sortAsc } from '../utils/functions.js';

const input = readInput();

const tickets = input
  .replace(/[FL]/g, '0')
  .replace(/[BR]/g, '1')
  .split('\n')
  .map((ticket) => {
    const row = parseInt(ticket.substr(0, 7), 2);
    const col = parseInt(ticket.substr(7, 3), 2);
    return row * 8 + col;
  })
  .sort(sortAsc);

const part1 = () => tickets[tickets.length - 1];

const part2 = () => {
  for (let i = 1; i < tickets.length; i++) {
    if (tickets[i] - tickets[i - 1] > 1) {
      return tickets[i] - 1;
    }
  }
};

console.log('part1', part1());
console.log('part2', part2());
