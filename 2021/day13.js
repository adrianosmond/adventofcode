const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input13.txt'), 'utf8');

let [dots, folds] = input.split('\n\n');
dots = dots.split('\n').map((r) => r.split(',').map((n) => parseInt(n, 10)));
folds = folds
  .split('\n')
  .map((f) => f.substring(11).split('='))
  .map(([a, b]) => [a, parseInt(b, 10)]);

const getPaper = () => {
  let maxX = Math.max(...dots.map(([x]) => x));
  if (maxX % 2 === 1) maxX++;

  let maxY = Math.max(...dots.map(([, y]) => y));
  if (maxY % 2 === 1) maxY++;

  const paper = new Array(maxY + 1)
    .fill(0)
    .map(() => new Array(maxX + 1).fill(' '));

  dots.forEach(([x, y]) => {
    paper[y][x] = '#';
  });

  return paper;
};

const fold = (foldsToDo) => {
  const paper = getPaper();
  let maxY = paper.length - 1;
  let maxX = paper[0].length - 1;

  for (let i = 0; i < foldsToDo.length; i++) {
    const [direction, position] = foldsToDo[i];
    if (direction === 'y') {
      for (let y = 0; y < position; y++) {
        for (let x = 0; x <= maxX; x++) {
          if (paper[y][x] === '#') continue;
          paper[y][x] = paper[maxY - y][x];
        }
      }
      maxY = position - 1;
    } else {
      for (let y = 0; y <= maxY; y++) {
        for (let x = 0; x < position; x++) {
          if (paper[y][x] === '#') continue;
          paper[y][x] = paper[y][maxX - x];
        }
      }
      maxX = position - 1;
    }
  }

  return paper
    .filter((_, i) => i <= maxY)
    .map((r) => r.filter((_, i) => i <= maxX));
};

const part1 = () =>
  fold([folds[0]])
    .flat()
    .filter((c) => c === '#').length;

const part2 = () =>
  fold(folds)
    .map((r) => r.join(''))
    .join('\n');

console.log('part1', part1());
console.log('part2');
console.log(part2());