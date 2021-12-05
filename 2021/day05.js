const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input05.txt'), 'utf8');

const lines = input
  .split('\n')
  .map((line) => line.match(/(\d+),(\d+) -> (\d+),(\d+)/))
  .map(([, x1, y1, x2, y2]) => [
    parseInt(x1, 10),
    parseInt(y1, 10),
    parseInt(x2, 10),
    parseInt(y2, 10),
  ]);

const countOverlaps = (coordinates) => {
  const grid = {};

  coordinates.forEach(([x1, y1, x2, y2]) => {
    let xDiff = 0;
    if (x2 > x1) xDiff = 1;
    if (x2 < x1) xDiff = -1;
    let yDiff = 0;
    if (y2 > y1) yDiff = 1;
    if (y2 < y1) yDiff = -1;

    const limit = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
    for (let i = 0; i <= limit; i++) {
      const key = `${x1 + i * xDiff},${y1 + i * yDiff}`;
      if (grid[key]) grid[key]++;
      else grid[key] = 1;
    }
  });

  return Object.values(grid).filter((cell) => cell > 1).length;
};

const part1 = () =>
  countOverlaps(lines.filter(([x1, y1, x2, y2]) => x1 === x2 || y1 === y2));

const part2 = () => countOverlaps(lines);

console.log('part1', part1());
console.log('part2', part2());
