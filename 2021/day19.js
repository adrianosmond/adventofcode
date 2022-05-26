import { readInput, manhattan3d } from '../utils/functions.js';

const input = readInput();

const scanners = input
  .replace(/--- scanner \d+ ---\n/g, '')
  .split('\n\n')
  .map((beacons) =>
    beacons
      .split('\n')
      .map((coords) => coords.split(',').map((n) => parseInt(n, 10))),
  );

const positions = [[0, 0, 0]];

const orientations = [
  ([x, y, z]) => [x, z, -y],
  ([x, y, z]) => [-z, x, -y],
  ([x, y, z]) => [-x, -z, -y],
  ([x, y, z]) => [z, -x, -y],
  ([x, y, z]) => [z, -y, x],
  ([x, y, z]) => [y, z, x],
  ([x, y, z]) => [-z, y, x],
  ([x, y, z]) => [-y, -z, x],
  ([x, y, z]) => [-y, x, z],
  ([x, y, z]) => [-x, -y, z],
  ([x, y, z]) => [y, -x, z],
  ([x, y, z]) => [x, y, z],
  ([x, y, z]) => [-z, -x, y],
  ([x, y, z]) => [x, -z, y],
  ([x, y, z]) => [z, x, y],
  ([x, y, z]) => [-x, z, y],
  ([x, y, z]) => [-x, y, -z],
  ([x, y, z]) => [-y, -x, -z],
  ([x, y, z]) => [x, -y, -z],
  ([x, y, z]) => [y, x, -z],
  ([x, y, z]) => [y, -z, -x],
  ([x, y, z]) => [z, y, -x],
  ([x, y, z]) => [-y, z, -x],
  ([x, y, z]) => [-z, -y, -x],
];

const getDifference = ([x1, y1, z1], [x2, y2, z2]) =>
  `${x1 - x2},${y1 - y2},${z1 - z2}`;

const maxManhattan = (posArr) => {
  let max = 0;
  for (let i = 0; i < posArr.length; i++) {
    for (let j = i + 1; j < posArr.length; j++) {
      max = Math.max(max, manhattan3d(posArr[i], posArr[j]));
    }
  }
  return max;
};

const part1 = () => {
  const s0 = scanners[0];
  while (scanners.length > 1) {
    for (let i = 1; i < scanners.length; i++) {
      const si = scanners[i];
      for (let o = 0; o < orientations.length; o++) {
        const or = orientations[o];
        const mapped = si.map((c) => or(c));
        const differences = {};
        for (let ci = 0; ci < s0.length; ci++) {
          for (let cj = 0; cj < mapped.length; cj++) {
            const diff = getDifference(s0[ci], mapped[cj]);
            if (!differences[diff]) differences[diff] = 0;
            differences[diff]++;
          }
        }
        const max = Math.max(...Object.values(differences));
        if (max >= 12) {
          const [dx, dy, dz] = Object.entries(differences)
            .find(([, v]) => v === max)[0]
            .split(',')
            .map((n) => parseInt(n, 10));

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

const part2 = () => maxManhattan(positions);

console.log('part1', part1());
console.log('part2', part2());
