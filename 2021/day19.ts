import readInput from '../utils/readInput.ts';
import {
  manhattan3d,
  multilineStrToIntArrays,
  strToIntArray,
} from '../utils/functions.ts';

const input = readInput();

const scanners = input
  .replace(/--- scanner \d+ ---\n/g, '')
  .split('\n\n')
  .map((beacons) => multilineStrToIntArrays(beacons, ','));

type Position = [number, number, number];

const positions: Position[] = [[0, 0, 0]];

const orientations = [
  ([x, y, z]: Position) => [x, z, -y],
  ([x, y, z]: Position) => [-z, x, -y],
  ([x, y, z]: Position) => [-x, -z, -y],
  ([x, y, z]: Position) => [z, -x, -y],
  ([x, y, z]: Position) => [z, -y, x],
  ([x, y, z]: Position) => [y, z, x],
  ([x, y, z]: Position) => [-z, y, x],
  ([x, y, z]: Position) => [-y, -z, x],
  ([x, y, z]: Position) => [-y, x, z],
  ([x, y, z]: Position) => [-x, -y, z],
  ([x, y, z]: Position) => [y, -x, z],
  ([x, y, z]: Position) => [x, y, z],
  ([x, y, z]: Position) => [-z, -x, y],
  ([x, y, z]: Position) => [x, -z, y],
  ([x, y, z]: Position) => [z, x, y],
  ([x, y, z]: Position) => [-x, z, y],
  ([x, y, z]: Position) => [-x, y, -z],
  ([x, y, z]: Position) => [-y, -x, -z],
  ([x, y, z]: Position) => [x, -y, -z],
  ([x, y, z]: Position) => [y, x, -z],
  ([x, y, z]: Position) => [y, -z, -x],
  ([x, y, z]: Position) => [z, y, -x],
  ([x, y, z]: Position) => [-y, z, -x],
  ([x, y, z]: Position) => [-z, -y, -x],
];

const getDifference = ([x1, y1, z1]: Position, [x2, y2, z2]: Position) =>
  `${x1 - x2},${y1 - y2},${z1 - z2}`;

const maxManhattan = (posArr: Position[]) => {
  let max = 0;
  for (let i = 0; i < posArr.length; i++) {
    for (let j = i + 1; j < posArr.length; j++) {
      max = Math.max(max, manhattan3d(posArr[i], posArr[j]));
    }
  }
  return max;
};

export const part1 = () => {
  const s0 = scanners[0] as Position[];
  while (scanners.length > 1) {
    for (let i = 1; i < scanners.length; i++) {
      const si = scanners[i] as Position[];
      for (let o = 0; o < orientations.length; o++) {
        const or = orientations[o];
        const mapped = si.map((c) => or(c)) as Position[];
        const differences: Record<string, number> = {};
        for (let ci = 0; ci < s0.length; ci++) {
          for (let cj = 0; cj < mapped.length; cj++) {
            const diff = getDifference(s0[ci], mapped[cj]);
            if (!differences[diff]) differences[diff] = 0;
            differences[diff]++;
          }
        }
        const max = Math.max(...Object.values(differences));
        if (max >= 12) {
          const [dx, dy, dz] = strToIntArray(
            Object.entries(differences).find(([, v]) => v === max)![0],
            ',',
          );

          positions.push([dx, dy, dz]);

          mapped
            .map(([x, y, z]) => [x + dx, y + dy, z + dz])
            .forEach(([x, y, z]) => {
              if (
                !s0.find(([sx, sy, sz]) => sx === x && sy === y && sz === z)
              ) {
                s0.push([x, y, z]);
              }
            });

          scanners.splice(i, 1);
          i--;
          break;
        }
      }
    }
  }

  return s0.length;
};

export const part2 = () => maxManhattan(positions);
