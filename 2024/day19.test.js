import runTests from '../utils/tests.js';

const testCases = [
  [
    `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`,
    [],
    6,
    [],
    16,
  ],
];

runTests(2024, 19, testCases);
