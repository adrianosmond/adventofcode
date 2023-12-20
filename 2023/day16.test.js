import runTests from '../utils/tests.js';

const testCases = [
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
    46,
    51,
  ],
];

runTests(2023, 16, testCases);
