import runTests from '../utils/tests.js';

const testCases = [
  [
    `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
    [],
    136,
    [],
    64,
  ],
];

runTests(2023, 14, testCases);
