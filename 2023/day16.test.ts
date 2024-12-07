import runTests, { type TestCase } from '../utils/tests.ts';

const testCases: TestCase[] = [
  [
    `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`,
    [],
    46,
    [],
    51,
  ],
];

runTests(2023, 16, testCases);
