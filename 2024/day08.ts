import readInput from '../utils/readInput.ts';
import { gridToCells, inputToCharGrid, gcd } from '../utils/functions.ts';

type Coords = [number, number];
const input = readInput();
const map = inputToCharGrid(input);
const positions = Object.entries(
  gridToCells(map)
    .filter((c) => c[0] !== '.')
    .reduce(
      (ant, [a, r, c]) => {
        if (!ant[a]) {
          ant[a] = [];
        }
        ant[a].push([r, c]);
        return ant;
      },
      {} as Record<string, Coords[]>,
    ),
).map(([, pos]) => pos);

const mapWidth = map[0].length;
const mapHeight = map.length;

const isInMap = ([r, c]: Coords) =>
  r >= 0 && c >= 0 && r < mapHeight && c < mapWidth;

function* getAntennaPairs() {
  for (let a = 0; a < positions.length; a++) {
    for (let i = 0; i < positions[a].length; i++) {
      for (let j = i + 1; j < positions[a].length; j++) {
        yield [positions[a][i], positions[a][j]];
      }
    }
  }
}

const countAntinodes = (
  processAntinodePair: (a1: Coords, a2: Coords) => Coords[],
) => {
  const allAntinodes: Record<string, true> = {};

  for (const [a1, a2] of getAntennaPairs()) {
    const antinodes = processAntinodePair(a1, a2);
    antinodes.forEach(([r, c]) => {
      allAntinodes[`${r},${c}`] = true;
    });
  }

  return Object.keys(allAntinodes).length;
};

export const part1 = () =>
  countAntinodes((a1, a2) => {
    const antinodes = [];
    const yDiff = a1[0] - a2[0];
    const xDiff = a1[1] - a2[1];
    const antinode1: Coords = [a1[0] + yDiff, a1[1] + xDiff];
    const antinode2: Coords = [a2[0] - yDiff, a2[1] - xDiff];
    if (isInMap(antinode1)) antinodes.push(antinode1);
    if (isInMap(antinode2)) antinodes.push(antinode2);
    return antinodes;
  });

export const part2 = () =>
  countAntinodes((a1, a2) => {
    const antinodes: Coords[] = [];
    let yDiff = a1[0] - a2[0];
    let xDiff = a1[1] - a2[1];
    if (yDiff === 0) {
      for (let c = 0; c < mapWidth; c++) antinodes.push([a1[0], c]);
      return antinodes;
    }
    if (xDiff === 0) {
      for (let r = 0; r < mapHeight; r++) antinodes.push([r, a1[1]]);
      return antinodes;
    }
    const scale = gcd(Math.abs(xDiff), Math.abs(yDiff));
    xDiff /= scale;
    yDiff /= scale;
    for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
      const antinode: Coords = [a1[0] + i * yDiff, a1[1] + i * xDiff];
      if (!isInMap(antinode)) break;
      antinodes.push(antinode);
    }
    for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
      const antinode: Coords = [a1[0] - i * yDiff, a1[1] - i * xDiff];
      if (!isInMap(antinode)) break;
      antinodes.push(antinode);
    }

    return antinodes;
  });
