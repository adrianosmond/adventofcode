import { readInput } from '../utils/functions.js';

const input = readInput();

const tiles = {};
const monsterCoords = [];
`                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `
  .split('\n')
  .forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      if (row[c] === '#') monsterCoords.push([r, c]);
    }
  });

input.split('\n\n').forEach((tile) => {
  const [title, ...rows] = tile.split('\n');
  const index = title.match(/Tile (\d+):/)[1];
  tiles[index] = {
    rows,
    edges: [
      { border: rows[0], linkedTile: null, linkedEdge: null },
      {
        border: rows
          .map((r) => r[r.length - 1])
          .flat()
          .join(''),
        linkedTile: null,
        linkedEdge: null,
      },
      { border: rows[rows.length - 1], linkedTile: null, linkedEdge: null },
      {
        border: rows
          .map((r) => r[0])
          .flat()
          .join(''),
        linkedTile: null,
        linkedEdge: null,
      },
    ],
  };
});

const part1 = () => {
  Object.entries(tiles).forEach(([tile, { edges }]) => {
    const otherTiles = Object.entries(tiles).filter(([t]) => t !== tile);

    edges.forEach((edge, i) => {
      if (edge.linkedTile) return;
      otherTiles.forEach(([t2, { edges: e2 }]) => {
        e2.forEach((edge2, j) => {
          if (edge2.linkedTile) return;
          if (
            edge.border === edge2.border ||
            edge.border === edge2.border.split('').reverse().join('')
          ) {
            edge.linkedTile = t2;
            edge2.linkedTile = tile;
            edge.linkedEdge = j;
            edge2.linkedEdge = i;
          }
        });
      });
    });
  });

  return Object.entries(tiles).reduce(
    (total, [tile, { edges }]) =>
      total *
      (edges.filter((e) => e.linkedTile).length === 2 ? parseInt(tile, 10) : 1),
    1,
  );
};

const rotate = (grid) => {
  const newGrid = [];
  for (let i = 0; i < grid.length; i++) {
    newGrid.push('');
    for (let j = 0; j < grid.length; j++) {
      newGrid[i] += grid[grid.length - 1 - j][i];
    }
  }
  return newGrid;
};

const rotateTile = (tileId) => {
  const tile = tiles[tileId];
  tile.rows = rotate(tile.rows);
  tile.edges.unshift(tile.edges.pop());
  tile.edges[0].border = tile.edges[0].border.split('').reverse().join('');
  tile.edges[2].border = tile.edges[2].border.split('').reverse().join('');
};

const flip = (grid) => {
  const newGrid = [];
  for (let i = 0; i < grid.length; i++) {
    newGrid.unshift('');
    for (let j = 0; j < grid.length; j++) {
      newGrid[0] += grid[i][j];
    }
  }
  return newGrid;
};

const flipTile = (tileId) => {
  const tile = tiles[tileId];
  tile.rows = flip(tile.rows);
  const tmp = tile.edges[0];
  tile.edges[0] = tile.edges[2];
  tile.edges[2] = tmp;

  tile.edges[1].border = tile.edges[1].border.split('').reverse().join('');
  tile.edges[3].border = tile.edges[3].border.split('').reverse().join('');
};

const part2 = () => {
  const topLeft = Object.entries(tiles).find(
    ([, { edges }]) => edges.filter((e) => e.linkedTile).length === 2,
  )[0];

  while (
    tiles[topLeft].edges[0].linkedTile !== null ||
    tiles[topLeft].edges[3].linkedTile !== null
  ) {
    rotateTile(topLeft);
  }

  const tileKeys = [];

  for (let row = 0; row < Math.sqrt(Object.keys(tiles).length); row++) {
    tileKeys.push([]);
    for (let col = 0; col < Math.sqrt(Object.keys(tiles).length); col++) {
      if (col === 0) {
        if (row === 0) {
          tileKeys[row][col] = topLeft;
          continue;
        } else {
          tileKeys[row][col] =
            tiles[tileKeys[row - 1][col]].edges[2].linkedTile;

          let rotations = 0;

          while (
            tiles[tileKeys[row - 1][col]].edges[2].border !==
            tiles[tileKeys[row][col]].edges[0].border
          ) {
            rotateTile(tileKeys[row][col]);
            rotations++;
            if (rotations === 4) flipTile(tileKeys[row][col]);
          }
        }
      } else {
        tileKeys[row][col] = tiles[tileKeys[row][col - 1]].edges[1].linkedTile;
        let rotations = 0;

        while (
          tiles[tileKeys[row][col - 1]].edges[1].border !==
          tiles[tileKeys[row][col]].edges[3].border
        ) {
          rotateTile(tileKeys[row][col]);
          rotations++;
          if (rotations === 4) flipTile(tileKeys[row][col]);
        }
      }
    }
  }

  let grid = [];
  for (let row = 0; row < tileKeys.length; row++) {
    for (let r = 1; r < tiles[topLeft].rows.length - 1; r++) {
      grid.push('');
      for (let col = 0; col < tileKeys[0].length; col++) {
        const cells = tiles[tileKeys[row][col]].rows[r];
        grid[grid.length - 1] += cells.substr(1, cells.length - 2);
      }
    }
  }
  const numHashes = grid.join('').replace(/[^#]/g, '').length;

  for (let rotations = 0; rotations < 8; rotations++) {
    let numMonsters = 0;
    for (let row = 0; row < grid.length - 3; row++) {
      for (let col = 0; col < grid[0].length - 20; col++) {
        if (monsterCoords.every(([r, c]) => grid[row + r][col + c] === '#')) {
          numMonsters++;
        }
      }
    }
    if (numMonsters > 0) {
      return numHashes - 15 * numMonsters;
    }
    if (rotations === 3) {
      grid = flip(grid);
    } else {
      grid = rotate(grid);
    }
  }
  return -1;
};

console.log('part1', part1());
console.log('part2', part2());
