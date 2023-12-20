// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals';

const mockRead = jest.fn();
jest.unstable_mockModule('../utils/readInput.js', () => ({
  default: mockRead,
}));
jest.spyOn(console, 'log').mockImplementation(() => {});

export default (year, day, testCases) => {
  describe(`${year} - day ${day}`, () => {
    beforeEach(() => {
      jest.resetModules();
    });
    testCases.forEach(([input, output1, output2], i) => {
      test(`Case ${i} - part 1`, async () => {
        mockRead.mockReturnValue(input);
        const { part1 } = await import(`../${year}/day${day}.js`);
        expect(part1()).toBe(output1);
      });

      if (output2) {
        test(`Case ${i} - part 2`, async () => {
          mockRead.mockReturnValue(input);
          const { part2 } = await import(`../${year}/day${day}.js`);
          expect(part2()).toBe(output2);
        });
      }
    });
  });
};
