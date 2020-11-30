const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input20.txt'), 'utf8');

const readInput = () => {
  const maze = input.split('\n').map((r) => r.split(''));

  let inner = null;
  const keys = {};
  const portals = {};
  let entrance;
  let exit;

  const addKey = (key, row, col, isInner = false) => {
    if (key === 'AA') {
      entrance = { row, col };
    } else if (key === 'ZZ') {
      exit = { row, col };
    } else if (keys[key]) {
      const tk = keys[key];
      portals[`${row},${col}`] = tk;
      portals[`${tk.row},${tk.col}`] = {
        row,
        col,
        levelDiff: isInner ? -1 : 1,
      };
    } else {
      keys[key] = { row, col, levelDiff: isInner ? -1 : 1 };
    }
  };

  for (let i = 2; i < maze[0].length - 2; i++) {
    if (maze[2][i] === '.') {
      const key = `${maze[0][i]}${maze[1][i]}`;
      addKey(key, 2, i);
    }
    if (maze[maze.length - 3][i] === '.') {
      const key = `${maze[maze.length - 2][i]}${maze[maze.length - 1][i]}`;
      addKey(key, maze.length - 3, i);
    }
    if (!inner && maze[i][i] !== '.' && maze[i][i] !== '#') {
      inner = i - 1;
    }
  }

  for (let i = 2; i < maze.length - 3; i++) {
    if (maze[i][2] === '.') {
      const key = `${maze[i][0]}${maze[i][1]}`;
      addKey(key, i, 2);
    }
    if (maze[i][maze[0].length - 3] === '.') {
      const key = `${maze[i][maze[0].length - 2]}${
        maze[i][maze[0].length - 1]
      }`;
      addKey(key, i, maze[0].length - 3);
    }
  }

  for (let i = inner; i < maze[0].length - inner; i++) {
    if (maze[inner][i] === '.') {
      const key = `${maze[inner + 1][i]}${maze[inner + 2][i]}`;
      addKey(key, inner, i, true);
    }
    if (maze[maze.length - (inner + 1)][i] === '.') {
      const key = `${maze[maze.length - (inner + 3)][i]}${
        maze[maze.length - (inner + 2)][i]
      }`;
      addKey(key, maze.length - (inner + 1), i, true);
    }
  }

  for (let i = inner; i < maze.length - inner; i++) {
    if (maze[i][inner] === '.') {
      const key = `${maze[i][inner + 1]}${maze[i][inner + 2]}`;
      addKey(key, i, inner, true);
    }
    if (maze[i][maze[0].length - (inner + 1)] === '.') {
      const key = `${maze[i][maze[0].length - (inner + 3)]}${
        maze[i][maze[0].length - (inner + 2)]
      }`;
      addKey(key, i, maze[0].length - (inner + 1), true);
    }
  }
  return [maze, portals, entrance, exit];
};

const createMap = (maze, val) => {
  const map = [];
  for (let i = 0; i < maze.length; i++) {
    const row = [];
    for (let j = 0; j < maze[0].length; j++) {
      row.push(val);
    }
    map.push(row);
  }
  return map;
};

const getAdjacentSquares = (maze, portals, current) => {
  const adj = [];

  const testAndAdd = (row, col) => {
    const cell = maze[row][col];
    if (cell === '.') {
      adj.push({ row, col, levelDiff: 0 });
    }
  };

  testAndAdd(current.row - 1, current.col);
  testAndAdd(current.row + 1, current.col);
  testAndAdd(current.row, current.col - 1);
  testAndAdd(current.row, current.col + 1);
  const currStr = `${current.row},${current.col}`;
  if (portals[currStr]) {
    adj.push({
      ...portals[currStr],
    });
  }

  return adj;
};

const getPath = (maze, portals, from, to, recursive = false) => {
  const maxLevels = recursive ? 30 : 1;
  const distances = new Array(maxLevels);
  for (let i = 0; i < maxLevels; i++) {
    distances[i] = createMap(maze, Number.MAX_SAFE_INTEGER);
  }
  distances[0][from.row][from.col] = 0;
  const queue = [
    {
      at: from,
      distance: 0,
      level: 0,
    },
  ];
  while (queue.length > 0) {
    const { at, distance, level } = queue.shift();
    if (level === 0 && at.row === to.row && at.col === to.col) {
      return distance;
    }
    const neighbours = getAdjacentSquares(maze, portals, at);
    neighbours.forEach((n) => {
      const nextLevel = recursive ? level + n.levelDiff : 0;
      if (
        nextLevel >= 0 &&
        nextLevel < maxLevels &&
        distance + 1 < distances[nextLevel][n.row][n.col]
      ) {
        distances[nextLevel][n.row][n.col] = distance + 1;
        queue.push({
          at: { ...n },
          distance: distance + 1,
          level: nextLevel,
        });
      }
    });
  }
  throw new Error('No path found');
};

const [maze, portals, entrance, exit] = readInput();
console.log('part1:', getPath(maze, portals, entrance, exit));
console.log('part2:', getPath(maze, portals, entrance, exit, true));
