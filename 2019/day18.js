import readInput from '../utils/readInput.js';
import { inputToCharGrid } from '../utils/functions.js';

const input = readInput();

const makeMaze = () => {
  const maze = inputToCharGrid(input);
  const keys = [];
  const me = {
    row: -1,
    col: -1,
  };
  for (let y = 0; y < maze.length; y++) {
    const row = maze[y];
    for (let x = 0; x < row.length; x++) {
      const cell = row[x];
      if (cell === '@') {
        row[x] = '.';
        me.row = y;
        me.col = x;
      } else if (/[a-z]/.test(cell)) {
        keys[cell] = {
          row: y,
          col: x,
        };
      }
    }
  }
  return [maze, keys, me];
};

const makeMazes = () => {
  const [maze, keys] = makeMaze();
  const yCentre = Math.floor(maze.length / 2);
  const xCentre = Math.floor(maze[0].length / 2);
  maze[yCentre][xCentre] = '#';
  maze[yCentre - 1][xCentre] = '#';
  maze[yCentre + 1][xCentre] = '#';
  maze[yCentre][xCentre - 1] = '#';
  maze[yCentre][xCentre + 1] = '#';
  const robots = {
    robot1: { row: yCentre - 1, col: xCentre - 1 },
    robot2: { row: yCentre + 1, col: xCentre - 1 },
    robot3: { row: yCentre + 1, col: xCentre + 1 },
    robot4: { row: yCentre - 1, col: xCentre + 1 },
  };
  return [maze, keys, robots];
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

const manhattan = (from, to) =>
  Math.abs(from.row - to.row) + Math.abs(from.col - to.col);

const getAdjacentSquares = (maze, current) => {
  const adj = [];

  const testAndAdd = (row, col) => {
    const cell = maze[row][col];
    if (cell !== '#') {
      adj.push({ row, col });
    }
  };

  testAndAdd(current.row - 1, current.col);
  testAndAdd(current.row + 1, current.col);
  testAndAdd(current.row, current.col - 1);
  testAndAdd(current.row, current.col + 1);

  return adj;
};

const matching = (neighbour) => (x) =>
  x.row === neighbour.row && x.col === neighbour.col;

const getPath = (maze, from, to) => {
  const closedSet = [];
  let openSet = [from];
  const gScore = createMap(maze, Number.MAX_SAFE_INTEGER);
  const fScore = createMap(maze, Number.MAX_SAFE_INTEGER);
  const cameFrom = createMap(maze, null);
  gScore[from.row][from.col] = 0;
  fScore[from.row][from.col] = manhattan(from, to);

  while (openSet.length > 0) {
    openSet.sort((a, b) => fScore[a.row][a.col] - fScore[b.row][b.col]);
    let current = openSet[0];

    if (current.row === to.row && current.col === to.col) {
      const path = [current];
      while (cameFrom[current.row][current.col]) {
        current = cameFrom[current.row][current.col];
        path.unshift(current);
      }
      return path;
    }

    openSet = openSet.filter(
      (x) => x.row !== current.row || x.col !== current.col,
    );
    closedSet.push(current);

    const neighbours = getAdjacentSquares(maze, current);
    for (let i = 0; i < neighbours.length; i++) {
      const neighbour = neighbours[i];
      if (closedSet.some(matching(neighbour))) {
        continue;
      }

      const tentativeGScore = gScore[current.row][current.col] + 1;
      if (!openSet.some(matching(neighbour))) {
        openSet.push(neighbour);
      }
      if (tentativeGScore >= gScore[neighbour.row][neighbour.col]) {
        continue;
      }

      cameFrom[neighbour.row][neighbour.col] = current;
      gScore[neighbour.row][neighbour.col] = tentativeGScore;
      fScore[neighbour.row][neighbour.col] =
        tentativeGScore + manhattan(neighbour, to);
    }
  }
  return -1;
};

const getDoorsFromPath = (maze, path) =>
  path.reduce((doors, cell, idx) => {
    if (idx === 0 || idx === path.length - 1) {
      return doors;
    }
    if (/[a-zA-Z]/.test(maze[cell.row][cell.col])) {
      return {
        ...doors,
        [maze[cell.row][cell.col].toLowerCase()]: true,
      };
    }
    return doors;
  }, {});

const makeKeyMap = (maze, starts, keys) => {
  const keyNames = Object.keys(keys);
  const keyMap = {};
  for (let i = 0; i < keyNames.length; i++) {
    keyMap[keyNames[i]] = {};
  }
  Object.entries(starts).forEach(([k, v]) => {
    keyMap[k] = {};
    for (let i = 0; i < keyNames.length; i++) {
      const key1 = keyNames[i];
      const path = getPath(maze, v, keys[key1]);
      if (path === -1) {
        continue;
      }
      const distance = path.length - 1;
      const doors = getDoorsFromPath(maze, path);
      keyMap[k][key1] = {
        distance,
        doors,
      };
    }
  });
  for (let i = 0; i < keyNames.length; i++) {
    const key1 = keyNames[i];
    for (let j = i + 1; j < keyNames.length; j++) {
      const key2 = keyNames[j];
      const path = getPath(maze, keys[key1], keys[key2]);
      if (path === -1) {
        continue;
      }
      const distance = path.length - 1;
      const doors = getDoorsFromPath(maze, path);
      const obj = {
        distance,
        doors,
      };
      keyMap[key1][key2] = obj;
      keyMap[key2][key1] = obj;
    }
  }
  return keyMap;
};

const arrToSortedStr = (arr) => [...arr].sort().join(',');

const keyCache = {};
const generateCacheId = (state) =>
  `${arrToSortedStr(state.currentKeys)},${arrToSortedStr(state.haveKeys)}`;

const getReachableKeys = (from, keyMap) => {
  const cacheId = generateCacheId(from);
  if (keyCache[cacheId]) {
    return keyCache[cacheId];
  }

  const { currentKeys, haveKeys } = from;
  const reachables = currentKeys.reduce(
    (all, current) => ({
      ...all,
      ...Object.entries(keyMap[current]).reduce((r, [k, v]) => {
        const doors = Object.keys(v.doors);
        if (!haveKeys.includes(k) && doors.every((d) => haveKeys.includes(d))) {
          return {
            ...r,
            [k]: {
              ...v,
              from: current,
            },
          };
        }
        return {
          ...r,
        };
      }, {}),
    }),
    {},
  );
  keyCache[cacheId] = reachables;
  return reachables;
};

const searchMaze = (from, keyMap) => {
  let bestDistance = Number.MAX_SAFE_INTEGER;

  const distances = {};
  const queue = [
    {
      currentKeys: from,
      haveKeys: [],
      distance: 0,
    },
  ];
  while (queue.length > 0) {
    const current = queue.shift();
    const neighbours = getReachableKeys(current, keyMap);
    const numNeighbours = Object.keys(neighbours).length;
    if (numNeighbours === 0) {
      if (current.distance < bestDistance) {
        bestDistance = current.distance;
      }
    }
    const keyStr = arrToSortedStr(current.haveKeys);

    Object.entries(neighbours).forEach(([key, value]) => {
      if (!distances[key]) {
        distances[key] = {};
      }
      if (
        !distances[key][keyStr] ||
        current.distance + value.distance < distances[key][keyStr]
      ) {
        distances[key][keyStr] = current.distance + value.distance;
        queue.push({
          currentKeys: current.currentKeys.map((k) =>
            k === value.from ? key : k,
          ),
          haveKeys: [...current.haveKeys, key],
          distance: current.distance + value.distance,
        });
      }
    });
  }

  return bestDistance;
};

const day18part1 = () => {
  const [maze, keys, me] = makeMaze();
  const keyMap = makeKeyMap(maze, { start: me }, keys);
  return searchMaze(['start'], keyMap);
};

const day18part2 = () => {
  const [maze, keys, robots] = makeMazes();
  const keyMap = makeKeyMap(maze, robots, keys);
  return searchMaze(Object.keys(robots), keyMap);
};

console.log('part1:', day18part1());
console.log('part2:', day18part2());
