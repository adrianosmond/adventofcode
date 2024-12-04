import runTests from '../utils/tests.js';

const testCases = [
  [
    `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
    [],
    18,
    [],
    9,
  ],
];

runTests(2024, 4, testCases);
