import runTests, { type TestCase } from '../utils/tests.ts';

const testCases: TestCase[] = [[`125 17`, [], 55312, [], 65601038650482]];

runTests(2024, 11, testCases);
