import readInput from '../utils/readInput.js';
import { multilineStrToIntArrays } from '../utils/functions.js';

const input = readInput();
const points = multilineStrToIntArrays(input, ',');

const manhattan4d = (from, to) =>
  Math.abs(from[0] - to[0]) +
  Math.abs(from[1] - to[1]) +
  Math.abs(from[2] - to[2]) +
  Math.abs(from[3] - to[3]);

// eslint-disable-next-line import/prefer-default-export
export const part1 = () => {
  const constellations = [];
  let maxC = 0;
  points.forEach((coords) => {
    const options = [];
    constellations.forEach((toTest) => {
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
