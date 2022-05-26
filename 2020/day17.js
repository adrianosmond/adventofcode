import { readInput } from '../utils/functions.js';

const input = readInput();

const rows = input.split('\n');

const grid3d = rows.map((r, rIdx) =>
  r.split('').map((c, cIdx) => [`${cIdx},${rIdx},0`, c === '#']),
);

const grid4d = rows.map((r, rIdx) =>
  r.split('').map((c, cIdx) => [`${cIdx},${rIdx},0,0`, c === '#']),
);

const makeGrid = (grid) =>
  Object.fromEntries(grid.flat().filter(([, value]) => value));

const getActiveNeighbours = (grid, x, y, z) => {
  let count = 0;
  for (let i = z - 1; i <= z + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      for (let k = x - 1; k <= x + 1; k++) {
        if (i === z && j === y && k === x) continue;
        if (grid[`${k},${j},${i}`]) count++;
      }
    }
  }
  return count;
};

const getActiveNeighbours4d = (grid, x, y, z, w) => {
  let count = 0;
  for (let i = z - 1; i <= z + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      for (let k = x - 1; k <= x + 1; k++) {
        for (let l = w - 1; l <= w + 1; l++) {
          if (i === z && j === y && k === x && l === w) continue;
          if (grid[`${k},${j},${i},${l}`]) count++;
        }
      }
    }
  }
  return count;
};

const part1 = () => {
  let grid = makeGrid(grid3d);
  let maxX = grid3d[0].length;
  let minX = 0;
  let maxY = grid3d.length;
  let minY = 0;
  let minZ = 0;
  let maxZ = 0;

  for (let i = 0; i < 6; i++) {
    const nextGrid = {};
    for (let z = minZ - 1; z <= maxZ + 1; z++) {
      for (let y = minY - 1; y <= maxY + 1; y++) {
        for (let x = minX - 1; x <= maxX + 1; x++) {
          const isActive = !!grid[`${x},${y},${z}`];
          const activeNeighbours = getActiveNeighbours(grid, x, y, z);

          if (activeNeighbours === 3 || (isActive && activeNeighbours === 2)) {
            nextGrid[`${x},${y},${z}`] = true;
          }
        }
      }
    }

    maxX++;
    minX--;
    maxY++;
    minY--;
    maxZ++;
    minZ--;
    grid = nextGrid;
  }
  return Object.keys(grid).length;
};

const part2 = () => {
  let grid = makeGrid(grid4d);
  let maxX = grid4d[0].length;
  let minX = 0;
  let maxY = grid4d.length;
  let minY = 0;
  let minZ = 0;
  let maxZ = 0;
  let minW = 0;
  let maxW = 0;

  for (let i = 0; i < 6; i++) {
    const nextGrid = {};
    for (let w = minW - 1; w <= maxW + 1; w++) {
      for (let z = minZ - 1; z <= maxZ + 1; z++) {
        for (let y = minY - 1; y <= maxY + 1; y++) {
          for (let x = minX - 1; x <= maxX + 1; x++) {
            const isActive = !!grid[`${x},${y},${z},${w}`];
            const activeNeighbours = getActiveNeighbours4d(grid, x, y, z, w);

            if (
              activeNeighbours === 3 ||
              (isActive && activeNeighbours === 2)
            ) {
              nextGrid[`${x},${y},${z},${w}`] = true;
            }
          }
        }
      }
    }

    maxX++;
    minX--;
    maxY++;
    minY--;
    maxZ++;
    minZ--;
    maxW++;
    minW--;
    grid = nextGrid;
  }
  return Object.keys(grid).length;
};

console.log('part1', part1());
console.log('part2', part2());
