import runTests from '../utils/tests.js';

const testCases = [
  [
    `1
10
100
2024`,
    [],
    37327623,
    [],
    24,
  ],
  [
    `1
2
3
2024`,
    [],
    37990510,
    [],
    23,
  ],
];

runTests(2024, 22, testCases);
