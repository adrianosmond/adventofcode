import runTests from '../utils/tests.js';

const testCases = [
  [
    `3   4
4   3
2   5
1   3
3   9
3   3`,
    [],
    11,
    [],
    31,
  ],
];

runTests(2024, 1, testCases);
