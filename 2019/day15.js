const input = require('./input15');
const { intComputer } = require('./intComputer');
const manhattan = require('../utils/functions');

const FLOOR = {
  UNKNOWN: -1,
  EMPTY: 0,
  WALL: 1,
};

const directions = [[], [0, -1], [0, 1], [-1, 0], [1, 0]];

const grid = {
  '0,0': FLOOR.EMPTY,
  '-1,0': FLOOR.UNKNOWN,
  '1,0': FLOOR.UNKNOWN,
  '0,-1': FLOOR.UNKNOWN,
  '0,1': FLOOR.UNKNOWN,
};

const unexplored = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const position = [0, 0];
let target;

const coordsToStr = (c) => `${c[0]},${c[1]}`;
const strToCoords = (str) => str.split(',').map((c) => parseInt(c, 10));

const getNeighbours = (coordStr) => {
  const coords = strToCoords(coordStr);
  return directions
    .map((d) => {
      if (d.length < 2) {
        return undefined;
      }
      const x = coords[0] + d[0];
      const y = coords[1] + d[1];
      const str = coordsToStr([x, y]);
      if (grid[str] !== FLOOR.WALL && grid[str] !== undefined) {
        return str;
      }
      return undefined;
    })
    .filter(Boolean);
};

const findShortestPath = (from, to) => {
  const fromStr = coordsToStr(from);
  const toStr = coordsToStr(to);
  const openSet = [fromStr];
  const cameFrom = {};
  const gScore = {};
  const fScore = {};
  Object.keys(grid).forEach((k) => {
    gScore[k] = Number.MAX_SAFE_INTEGER;
    fScore[k] = Number.MAX_SAFE_INTEGER;
  });
  gScore[fromStr] = 0;
  fScore[fromStr] = manhattan(from, to);

  while (openSet.length > 0) {
    openSet.sort((a, b) => fScore[a] - fScore[b]);
    let current = openSet.shift();
    if (current === toStr) {
      const path = [current];
      while (cameFrom[current]) {
        current = cameFrom[current];
        path.unshift(current);
      }
      return path.map((s) => strToCoords(s));
    }
    const neighbours = getNeighbours(current);
    neighbours.forEach((n) => {
      const possibleGScore = gScore[current] + 1;
      const isUnknown = grid[n] === FLOOR.UNKNOWN;
      const isTo = n === toStr;
      if (possibleGScore < gScore[n] && (isTo || !isUnknown)) {
        cameFrom[n] = current;
        gScore[n] = possibleGScore;
        fScore[n] = gScore[n] + manhattan(strToCoords(n), to);
        if (!openSet.includes(n)) {
          openSet.push(n);
        }
      }
    });
  }
  throw new Error(`Couldn't find path between ${fromStr} and ${toStr}`);
};

const findClosestUnexplored = () => {
  if (!target) {
    target = unexplored.shift();
  }

  while (target && grid[coordsToStr(target)] !== FLOOR.UNKNOWN) {
    target = unexplored.shift();
  }

  if (!target) {
    return [];
  }
  return findShortestPath(position, target);
};

const extendGrid = () => {
  directions.forEach((d) => {
    if (d.length === 2) {
      const x = position[0] + d[0];
      const y = position[1] + d[1];
      if (grid[`${x},${y}`] === undefined) {
        grid[`${x},${y}`] = FLOOR.UNKNOWN;
        if (unexplored.findIndex((e) => e[0] === x && e[1] === y) === -1) {
          unexplored.unshift([x, y]);
        }
      }
    }
  });
};

const getCommand = ([fromX, fromY], [toX, toY]) =>
  directions.findIndex((d) => d[0] === toX - fromX && d[1] === toY - fromY);

const getCommands = (path) => {
  const commands = [];
  for (let i = 1; i < path.length; i++) {
    commands.push(getCommand(path[i - 1], path[i]));
  }
  return commands;
};

const inputs = [1];
const computer = intComputer(input, inputs);
let iteration = 0;
let oxygen;

for (const output of computer) {
  const command = inputs[iteration];
  iteration++;
  if (output === 0) {
    const d = directions[command];
    const x = position[0] + d[0];
    const y = position[1] + d[1];
    grid[`${x},${y}`] = FLOOR.WALL;
  } else {
    const d = directions[command];
    position[0] += d[0];
    position[1] += d[1];
    if (target) {
      if (position[0] === target[0] && position[1] === target[1]) {
        target = undefined;
      }
    }
    if (iteration < inputs.length) {
      continue;
    }
    grid[coordsToStr(position)] = FLOOR.EMPTY;
    extendGrid();
    if (output === 2) {
      oxygen = [...position];
    }
  }
  const path = findClosestUnexplored();
  const commands = getCommands(path);
  inputs.push(...commands);
}

console.log('part1:', findShortestPath([0, 0], oxygen).length - 1);

const allDistances = Object.keys(grid)
  .filter((k) => grid[k] === FLOOR.EMPTY)
  .map((k) => findShortestPath(oxygen, strToCoords(k)).length - 1);

console.log('part2:', Math.max(...allDistances));
