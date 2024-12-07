import readInput from '../utils/readInput.ts';
import { splitAndMapInputLines } from '../utils/functions.ts';
import { sum } from '../utils/reducers.ts';

const input = readInput();
const instructions = splitAndMapInputLines(input, ' = ');

const getValue = (mask: string, val: number) => {
  const binaryVal = val.toString(2).padStart(mask.length, '0');
  let valStr = '';
  for (let i = 0; i < mask.length; i++) {
    valStr += mask[i] === 'X' ? binaryVal[i] : mask[i];
  }
  return parseInt(valStr, 2);
};

const getAllMasks = (mask: string): string[] => {
  const zero = mask.replace('X', '0');
  const one = mask.replace('X', '1');

  if (!zero.includes('X')) return [zero, one];
  return [getAllMasks(zero), getAllMasks(one)].flat();
};

const getDecodedAddresses = (
  originalMask: string,
  replacedMasks: string[],
  address: number,
) =>
  replacedMasks.map((mask) => {
    const binaryAddr = address.toString(2).padStart(mask.length, '0');
    let addrStr = '';
    for (let i = 0; i < mask.length; i++) {
      addrStr += originalMask[i] === '0' ? binaryAddr[i] : mask[i];
    }

    return parseInt(addrStr, 2);
  });

export const part1 = () => {
  const memory: Record<number, number> = {};
  let mask: string;

  instructions.forEach(([i, v]) => {
    if (i === 'mask') {
      mask = v;
    } else {
      const address = parseInt(i.match(/mem\[([0-9]+)\]/)![1], 10);
      const val = parseInt(v, 10);
      memory[address] = getValue(mask, val);
    }
  });

  return Object.values(memory).reduce(sum);
};

export const part2 = () => {
  const memory: Record<number, number> = {};
  let originalMask: string;
  let replacedMasks: string[];

  instructions.forEach(([i, v]) => {
    if (i === 'mask') {
      originalMask = v;
      replacedMasks = getAllMasks(v);
    } else {
      const originalAddress = parseInt(i.match(/mem\[([0-9]+)\]/)![1], 10);
      const value = parseInt(v, 10);

      getDecodedAddresses(originalMask, replacedMasks, originalAddress).forEach(
        (decodedAddress) => {
          memory[decodedAddress] = value;
        },
      );
    }
  });

  return Object.values(memory).reduce(sum);
};
