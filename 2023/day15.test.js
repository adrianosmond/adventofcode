import runTests from '../utils/tests.js';

const testCases = [
  [`rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`, [], 1320, [], 145],
];

runTests(2023, 15, testCases);
