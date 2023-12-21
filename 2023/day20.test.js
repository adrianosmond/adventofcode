import runTests from '../utils/tests.js';

const testCases = [
  [
    `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`,
    [],
    32000000,
  ],
  [
    `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`,
    [],
    11687500,
  ],
];

runTests(2023, 20, testCases);
