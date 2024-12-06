import runTests from '../utils/tests.js';

const testCases = [
  [
    `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
    [],
    41,
    [],
    6,
  ],
];

runTests(2024, 5, testCases);
