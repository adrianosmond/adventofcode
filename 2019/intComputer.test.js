import { intComputer } from './intComputer.js';
import testData from './intComputer.test.data.js';

const { duplicator, is8, input5, input9 } = testData;

const getOutputs = (computer) => {
  const outputs = [];

  for (const output of computer) {
    outputs.push(output);
  }
  return outputs;
};

describe('Intcode computer', () => {
  describe('Day 5', () => {
    describe('samples', () => {
      describe('position mode', () => {
        describe('equals 8', () => {
          const eq8 = [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8];

          test('< 8 returns 0', () => {
            expect(getOutputs(intComputer(eq8, [5]))).toEqual([0]);
          });

          test('> 8 returns 0', () => {
            expect(getOutputs(intComputer(eq8, [15]))).toEqual([0]);
          });

          test('= 8 returns 1', () => {
            expect(getOutputs(intComputer(eq8, [8]))).toEqual([1]);
          });
        });

        describe('less than 8', () => {
          const lt8 = [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8];

          test('< 8 returns 1', () => {
            expect(getOutputs(intComputer(lt8, [5]))).toEqual([1]);
          });

          test('> 8 returns 0', () => {
            expect(getOutputs(intComputer(lt8, [15]))).toEqual([0]);
          });

          test('= 8 returns 0', () => {
            expect(getOutputs(intComputer(lt8, [8]))).toEqual([0]);
          });
        });

        describe('equals 0', () => {
          const eq0 = [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9];

          test('< 0 returns 1', () => {
            expect(getOutputs(intComputer(eq0, [-5]))).toEqual([1]);
          });

          test('> 0 returns 1', () => {
            expect(getOutputs(intComputer(eq0, [15]))).toEqual([1]);
          });

          test('= 0 returns 0', () => {
            expect(getOutputs(intComputer(eq0, [0]))).toEqual([0]);
          });
        });
      });

      describe('immediate mode', () => {
        describe('equals 8', () => {
          const eq8 = [3, 3, 1108, -1, 8, 3, 4, 3, 99];

          test('< 8 returns 0', () => {
            expect(getOutputs(intComputer(eq8, [5]))).toEqual([0]);
          });

          test('> 8 returns 0', () => {
            expect(getOutputs(intComputer(eq8, [15]))).toEqual([0]);
          });

          test('= 8 returns 1', () => {
            expect(getOutputs(intComputer(eq8, [8]))).toEqual([1]);
          });
        });

        describe('less than 8', () => {
          const lt8 = [3, 3, 1107, -1, 8, 3, 4, 3, 99];

          test('< 8 returns 1', () => {
            expect(getOutputs(intComputer(lt8, [5]))).toEqual([1]);
          });

          test('> 8 returns 0', () => {
            expect(getOutputs(intComputer(lt8, [15]))).toEqual([0]);
          });

          test('= 8 returns 0', () => {
            expect(getOutputs(intComputer(lt8, [8]))).toEqual([0]);
          });
        });

        describe('equals 0', () => {
          const eq0 = [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1];

          test('< 0 returns 1', () => {
            expect(getOutputs(intComputer(eq0, [-5]))).toEqual([1]);
          });

          test('> 0 returns 1', () => {
            expect(getOutputs(intComputer(eq0, [15]))).toEqual([1]);
          });

          test('= 0 returns 0', () => {
            expect(getOutputs(intComputer(eq0, [0]))).toEqual([0]);
          });
        });
      });

      describe('final sample', () => {
        test('< 8 returns 999', () => {
          expect(getOutputs(intComputer(is8, [5]))).toEqual([999]);
        });

        test('> 8 returns 1001', () => {
          expect(getOutputs(intComputer(is8, [15]))).toEqual([1001]);
        });

        test('= 8 returns 1000', () => {
          expect(getOutputs(intComputer(is8, [8]))).toEqual([1000]);
        });
      });
    });

    test('part 1', () => {
      expect(getOutputs(intComputer(input5, [1]))).toEqual([
        ...new Array(9).fill(0),
        15386262,
      ]);
    });

    test('part 2', () => {
      expect(getOutputs(intComputer(input5, [5]))).toEqual([10376124]);
    });
  });

  describe('Day 9', () => {
    test('sample 1', () => {
      expect(getOutputs(intComputer(duplicator, []))).toEqual(duplicator);
    });

    test('sample 2', () => {
      expect(
        getOutputs(intComputer([1102, 34915192, 34915192, 7, 4, 7, 99, 0], [])),
      ).toEqual([1219070632396864]);
    });

    test('sample 3', () => {
      expect(getOutputs(intComputer([104, 1125899906842624, 99], []))).toEqual([
        1125899906842624,
      ]);
    });

    test('part 1', () => {
      expect(getOutputs(intComputer(input9, [1]))).toEqual([2171728567]);
    });

    test('part 2', () => {
      expect(getOutputs(intComputer(input9, [2]))).toEqual([49815]);
    });
  });
});
