import runTests, { type TestCase } from '../utils/tests.ts';

const testCases: TestCase[] = [
  [
    `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`,
    [6],
    16,
  ],
];

runTests(2023, 21, testCases);
