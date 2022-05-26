import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input24.txt'), 'utf8');

const instructions = input.split('\n').map((line) =>
  line
    .replace(/([ew])/g, '$1,')
    .replace(/,$/, '')
    .split(','),
);

let tiles = {};
let minX = 0;
let minY = 0;
let maxX = 0;
let maxY = 0;

const updateBounds = () => {
  const keys = Object.keys(tiles).map((key) =>
    key.split(',').map((x) => parseInt(x, 10)),
  );

  const xs = keys.map(([x]) => x);
  const ys = keys.map(([, y]) => y);

  minX = Math.min(...xs);
  maxX = Math.max(...xs);
  minY = Math.min(...ys);
  maxY = Math.max(...ys);
};

const part1 = () => {
  instructions.forEach((directions) => {
    let x = 0;
    let y = 0;
    directions.forEach((direction) => {
      if (direction === 'w') {
        x -= 2;
      } else if (direction === 'nw') {
        y += 1;
        x -= 1;
      } else if (direction === 'ne') {
        y += 1;
        x += 1;
      } else if (direction === 'e') {
        x += 2;
      } else if (direction === 'se') {
        y -= 1;
        x += 1;
      } else if (direction === 'sw') {
        y -= 1;
        x -= 1;
      }
    });
    const key = `${x},${y}`;
    if (tiles[key]) {
      delete tiles[key];
    } else {
      tiles[key] = true;
    }
  });

  return Object.keys(tiles).length;
};

const getAdjacentBlackTiles = (col, row) => {
  let numBlackTiles = 0;

  if (tiles[`${col - 2},${row}`]) numBlackTiles++;
  if (tiles[`${col + 2},${row}`]) numBlackTiles++;
  if (tiles[`${col - 1},${row - 1}`]) numBlackTiles++;
  if (tiles[`${col - 1},${row + 1}`]) numBlackTiles++;
  if (tiles[`${col + 1},${row - 1}`]) numBlackTiles++;
  if (tiles[`${col + 1},${row + 1}`]) numBlackTiles++;

  return numBlackTiles;
};

const part2 = () => {
  for (let round = 0; round < 100; round++) {
    updateBounds();
    const newTiles = {};
    for (let row = minY - 2; row <= maxY + 2; row++) {
      for (let col = minX - 2; col <= maxX + 2; col += 2) {
        if (row % 2 !== col % 2) col--;
        const key = `${col},${row}`;
        const adjacentBlackTiles = getAdjacentBlackTiles(col, row);
        const isBlack = tiles[key];
        if (
          (isBlack && adjacentBlackTiles === 1) ||
          (isBlack && adjacentBlackTiles === 2) ||
          (!isBlack && adjacentBlackTiles === 2)
        ) {
          newTiles[key] = true;
        }
      }
    }
    tiles = newTiles;
  }
  return Object.keys(tiles).length;
};

console.log('part1', part1());
console.log('part2', part2());
