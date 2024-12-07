import runTests, { type TestCase } from '../utils/tests.ts';

const testCases: TestCase[] = [
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
