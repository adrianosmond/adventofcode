import runTests from '../utils/tests.js';

const testCases = [
  [
    `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
    [],
    374,
    [100],
    8410,
  ],
];

runTests(2023, 11, testCases);
