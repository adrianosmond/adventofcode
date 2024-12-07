import runTests, { type TestCase } from '../utils/tests.ts';

const testCases: TestCase[] = [
  [
    `029A
980A
179A
456A
379A`,
    [],
    126384,
    [],
    154115708116294,
  ],
];

runTests(2024, 21, testCases);
