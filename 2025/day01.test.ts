import runTests, { type TestCase } from '../utils/tests.ts';

const testCases: TestCase[] = [
  [
    `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`,
    [],
    3,
    [],
    6,
  ],
];

runTests(2025, 1, testCases);
