// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals';

const mockRead = jest.fn();
jest.unstable_mockModule('../utils/readInput.js', () => ({
  default: mockRead,
}));
jest.spyOn(console, 'log').mockImplementation(() => {});

export default (year, day, testCases) => {
  const dayStr = day.toString().padStart(2, '0');
  describe(`${year} - day ${day}`, () => {
    beforeEach(() => {
      jest.resetModules();
    });
    testCases.forEach(([input, args1, output1, args2, output2], i) => {
      test(`Case ${i} - part 1`, async () => {
        mockRead.mockReturnValue(input);
        const { part1 } = await import(`../${year}/day${dayStr}.js`);
        expect(part1(...args1)).toBe(output1);
      });

      if (output2) {
        test(`Case ${i} - part 2`, async () => {
          mockRead.mockReturnValue(input);
          const { part2 } = await import(`../${year}/day${dayStr}.js`);
          expect(part2(...args2)).toBe(output2);
        });
      }
    });
  });
};
