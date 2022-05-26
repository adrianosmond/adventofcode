import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input22.txt'), 'utf8');
const [, , ...listings] = input.split('\n');
const processed = listings.map((l) => {
  const [, x, y, used, avail] = l.match(
    '/dev/grid/node-x(\\d+)-y(\\d+)\\s+\\d+T\\s+(\\d+)T\\s+(\\d+)T\\s+\\d+%',
  );
  return [
    parseInt(x, 10),
    parseInt(y, 10),
    parseInt(used, 10),
    parseInt(avail, 10),
  ];
});

const part1 = () => {
  let pairs = 0;
  for (let a = 0; a < processed.length; a++) {
    for (let b = 0; b < processed.length; b++) {
      if (a === b) continue;
      if (processed[a][2] > 0 && processed[a][2] <= processed[b][3]) {
        pairs++;
      }
    }
  }
  return pairs;
};

/* Worked out by hand. My grid is:
  .....................................G
  ......................................
  ......................................
  ......................................
  ......................................
  ......................................
  ......................................
  ......................................
  ......................................
  ......................................
  ......................................
  ......................................
  ......................................
  ......................................
  ......................................
  ......................................
  ......................................
  ......................................
  ......................................
  ..............................########
  ......................................
  ...................................0..
  ......................................
  ......................................

  It takes 35 moves to get the 0 around the wall of nodes
  which are too large and up to the top right corner. 
  From there we need to shift the G left 36 times, and it 
  takes 5 moves of the 0 to make the G move left once. 
  
  35 + 36*5 = 215 */
const part2 = () => 215;

console.log('part1', part1());
console.log('part2', part2());
console.log(
  '      ^^^ This was worked out manually and is likely not your answer',
);
