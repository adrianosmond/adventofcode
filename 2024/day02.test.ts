import runTests, { type TestCase } from '../utils/tests.ts';

const testCases: TestCase[] = [
  [
    `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
    [],
    2,
    [],
    4,
  ],
];

runTests(2024, 2, testCases);
