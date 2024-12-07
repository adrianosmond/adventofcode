import { vi, describe, test, expect, beforeEach } from 'vitest';

const mockRead = vi.fn<() => string>();
vi.mock('../utils/readInput.ts', () => ({
  default: mockRead,
}));
vi.spyOn(console, 'log').mockImplementation(() => {});

export type TestCase = [
  input: string,
  args1: unknown[],
  output1: unknown,
  args2?: unknown[],
  output2?: unknown,
];

export default (year: number, day: number, testCases: TestCase[]) => {
  const dayStr = day.toString().padStart(2, '0');
  describe(`${year} - day ${day}`, () => {
    beforeEach(() => {
      vi.resetModules();
    });
    testCases.forEach(([input, args1, output1, args2, output2], i) => {
      test(`Case ${i} - part 1`, async () => {
        mockRead.mockReturnValue(input);
        const { part1 } = await import(`../${year}/day${dayStr}.ts`);
        expect(part1(...args1)).toBe(output1);
      });

      if (output2 !== undefined) {
        test(`Case ${i} - part 2`, async () => {
          mockRead.mockReturnValue(input);
          const { part2 } = await import(`../${year}/day${dayStr}.ts`);
          expect(part2(...(args2 ?? []))).toBe(output2);
        });
      }
    });
  });
};
