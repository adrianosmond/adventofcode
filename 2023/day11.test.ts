import runTests, { type TestCase } from '../utils/tests.ts';

const testCases: TestCase[] = [
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
