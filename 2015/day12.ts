import readInput from '../utils/readInput.ts';

const input = readInput();
const json = JSON.parse(input);

const isRecord = (val: unknown): val is Record<string, unknown> => {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
};

const getSumOfValues = (vals: unknown[], ignoreRed = false): number =>
  vals.reduce((total: number, val: unknown) => {
    if (typeof val === 'string') return total;
    if (typeof val === 'number') return total + val;
    if (Array.isArray(val)) return total + getSumOfValues(val, ignoreRed);
    if (isRecord(val)) {
      if (ignoreRed && Object.values(val).includes('red')) return total;
      return total + getSumOfValues(Object.values(val), ignoreRed);
    }
    return total;
  }, 0);

export const part1 = () => getSumOfValues(Object.values(json));

export const part2 = () => getSumOfValues(Object.values(json), true);
