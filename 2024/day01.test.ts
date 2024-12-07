import runTests, { type TestCase } from '../utils/tests.ts';

const testCases: TestCase[] = [
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
