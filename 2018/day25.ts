import readInput from '../utils/readInput.ts';
import { multilineStrToIntArrays } from '../utils/functions.ts';

const input = readInput();
const points = multilineStrToIntArrays(input, ',');

const manhattan4d = (from: number[], to: number[]): number =>
  Math.abs(from[0] - to[0]) +
  Math.abs(from[1] - to[1]) +
  Math.abs(from[2] - to[2]) +
  Math.abs(from[3] - to[3]);

type Constellation = {
  coords: number[];
  constellation: number;
};

export const part1 = () => {
  const constellations: Constellation[] = [];
  let maxC = 0;
  points.forEach((coords: number[]) => {
    const options: number[] = [];
    constellations.forEach((toTest: Constellation) => {
      if (
        manhattan4d(coords, toTest.coords) <= 3 &&
        !options.includes(toTest.constellation)
      ) {
        options.push(toTest.constellation);
      }
    });
    if (options.length === 0) {
      constellations.push({
        coords,
        constellation: maxC++,
      });
    } else if (options.length === 1) {
      constellations.push({
        coords,
        constellation: options[0],
      });
    } else {
      constellations.push({
        coords,
        constellation: options[0],
      });
      for (let i = 0; i < options.length; i++) {
        const toMerge = constellations.filter(
          (x) => x.constellation === options[i],
        );
        for (let j = 0; j < toMerge.length; j++) {
          const x = toMerge[j];
          [x.constellation] = options;
        }
      }
    }
  });

  return new Set(constellations.map((c) => c.constellation)).size;
};
