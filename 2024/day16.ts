import readInput from '../utils/readInput.ts';
import { getNeighbours, inputToCharGrid } from '../utils/functions.ts';

const input = readInput();
const grid = inputToCharGrid(input);
const start: Coords = [grid.length - 2, 1];
const end: Coords = [1, grid[0].length - 2];
grid[start[0]][start[1]] = '.';
grid[end[0]][end[1]] = '.';

type Direction = 'N' | 'E' | 'S' | 'W';
type Coords = [number, number];
const visited: Record<string, Partial<Record<Direction, number>>> = {};

const makeKey = ([r, c]: Coords) => `${r},${c}`;

export const part1 = () => {
  const queue: [Coords, Direction][] = [[start, 'E']];
  visited[makeKey(start)] = {
    E: 0,
  };
  while (queue.length > 0) {
    const [pos, dir] = queue.shift()!;
    const posKey = makeKey(pos);
    const score = visited[posKey][dir]!;
    // if we made it to the end we don't need to do anything else
    if (pos[0] === end[0] && pos[1] === end[1]) {
      continue;
    }
    const neighbours = getNeighbours(grid, ...pos, true)
      .map((n, i) => {
        if (i === 0) return [n, 'S'];
        if (i === 1) return [n, 'N'];
        if (i === 2) return [n, 'E'];
        if (i === 3) return [n, 'W'];
        throw new Error('Something went wrong');
      })
      // no going off the grid or into walls
      .filter(([n]) => n !== null && n[2] !== '#')
      // no 180 degree turns
      .filter(
        ([, d]) =>
          (dir === 'N' && d !== 'S') ||
          (dir === 'S' && d !== 'N') ||
          (dir === 'E' && d !== 'W') ||
          (dir === 'W' && d !== 'E'),
      ) as [[number, number], Direction][];

    neighbours.forEach((neighbour) => {
      const [nextPos, nextDir] = neighbour;
      const nextPosKey = makeKey(nextPos);
      const nextScore = score + 1 + (nextDir === dir ? 0 : 1000);
      if (!visited[nextPosKey]) visited[nextPosKey] = {};
      // if we already found a better way to get to this state, we can stop
      if (
        visited[nextPosKey][nextDir] &&
        visited[nextPosKey][nextDir] <= nextScore
      )
        return;
      visited[nextPosKey][nextDir] = nextScore;
      // if we had to turn to move to this neighbour, add an entry on the
      // previous cell with the rotation and increasing the score by 1000
      if (nextDir !== dir) {
        visited[posKey][nextDir] = Math.min(
          visited[posKey][nextDir] || Number.MAX_SAFE_INTEGER,
          score + 1000,
        );
      }
      queue.push(neighbour);
    });
  }
  return Math.min(...Object.values(visited[makeKey(end)]));
};

export const part2 = () => {
  if (Object.keys(visited).length === 0) part1();
  const queue: [Coords, Direction][] = [];
  const finalScore = Math.min(...Object.values(visited[makeKey(end)]));
  const onBestPath = {
    [makeKey(start)]: true,
    [makeKey(end)]: true,
  };
  if (visited[makeKey(end)].N === finalScore) {
    queue.push([end, 'N']);
  }
  if (visited[makeKey(end)].E === finalScore) {
    queue.push([end, 'E']);
  }

  while (queue.length > 0) {
    const [pos, direction] = queue.shift()!;
    const posKey = makeKey(pos);
    const score = visited[posKey][direction]!;

    const neighbours = getNeighbours(grid, ...pos, true)
      // reverse the directions because we're tracing the path backwards
      .map((n, i) => {
        if (i === 0) return [n, 'N'];
        if (i === 1) return [n, 'S'];
        if (i === 2) return [n, 'W'];
        if (i === 3) return [n, 'E'];
        throw new Error('Something went wrong');
      })
      // no going off the grid or into walls
      .filter(([n]) => n !== null && n[2] !== '#') as [
      [number, number],
      Direction,
    ][];

    neighbours.forEach((neighbour) => {
      const [nextPos, nextDir] = neighbour;
      if (
        nextDir === direction &&
        visited[makeKey(nextPos)][direction] === score - 1
      ) {
        onBestPath[makeKey(nextPos)] = true;
        queue.push(neighbour);
      }
    });

    // If a turn took place on this cell, add it back on the queue
    // with the direction after the turn.
    Object.entries(visited[posKey])
      .filter(([k, v]) => v === score - 1000 && k !== direction)
      .forEach(([k]) => {
        queue.push([pos, k as Direction]);
      });
  }

  return Object.keys(onBestPath).length;
};
