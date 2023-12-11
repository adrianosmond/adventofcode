import { gridToCells, manhattan, readInput } from '../utils/functions.js';

const input = readInput();

const galaxyGrid = input.split('\n').map((r) => r.split(''));
const galaxies = gridToCells(galaxyGrid)
  .filter(([cell]) => cell === '#')
  .map(([, row, col]) => ({
    row,
    col,
    rowExpansion: 0,
    colExpansion: 0,
  }));

const emptyRows = [...Array(galaxyGrid.length).keys()].filter(
  (r) => !galaxies.some((g) => g.row === r),
);

const emptyCols = [...Array(galaxyGrid[0].length).keys()].filter(
  (c) => !galaxies.some((g) => g.col === c),
);

galaxies.forEach((g) => {
  g.colExpansion = emptyCols.filter((c) => c < g.col).length;
  g.rowExpansion = emptyRows.filter((r) => r < g.row).length;
});

const getDistance = () => {
  let total = 0;
  for (let i = 0; i < galaxies.length; i++) {
    const g1 = galaxies[i];
    for (let j = i + 1; j < galaxies.length; j++) {
      const g2 = galaxies[j];
      total += manhattan([g1.col, g1.row], [g2.col, g2.row]);
    }
  }
  return total;
};

const part1 = () => {
  galaxies.forEach((g) => {
    g.col += g.colExpansion;
    g.row += g.rowExpansion;
  });

  return getDistance();
};

const part2 = () => {
  // one million times larger !== one million expansions
  // it's 999,999 expansions, but we already did one in p1
  // so we'll do 999,998 instead
  galaxies.forEach((g) => {
    g.col += 999998 * g.colExpansion;
    g.row += 999998 * g.rowExpansion;
  });

  return getDistance();
};

console.log('part1', part1());
console.log('part2', part2());
