import readInput from '../utils/readInput.js';
import { splitAndMapInputLines } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = readInput();
const instructions = splitAndMapInputLines(input, ' = ');

const getValue = (mask, val) => {
  const binaryVal = val.toString(2).padStart(mask.length, '0');
  let valStr = '';
  for (let i = 0; i < mask.length; i++) {
    valStr += mask[i] === 'X' ? binaryVal[i] : mask[i];
  }
  return parseInt(valStr, 2);
};

const getAllMasks = (mask) => {
  if (!mask.includes('X')) return mask;

  return [
    getAllMasks(mask.replace('X', '0')),
    getAllMasks(mask.replace('X', '1')),
  ].flat();
};

const getDecodedAddresses = (originalMask, replacedMasks, address) =>
  replacedMasks.map((mask) => {
    const binaryAddr = address.toString(2).padStart(mask.length, '0');
    let addrStr = '';
    for (let i = 0; i < mask.length; i++) {
      addrStr += originalMask[i] === '0' ? binaryAddr[i] : mask[i];
    }

    return parseInt(addrStr, 2);
  });

export const part1 = () => {
  const memory = {};
  let mask;

  instructions.forEach(([i, v]) => {
    if (i === 'mask') {
      mask = v;
    } else {
      const address = parseInt(i.match(/mem\[([0-9]+)\]/)[1], 10);
      const val = parseInt(v, 10);
      memory[address] = getValue(mask, val);
    }
  });

  return Object.values(memory).reduce(sum);
};

export const part2 = () => {
  const memory = {};
  let originalMask;
  let replacedMasks;

  instructions.forEach(([i, v]) => {
    if (i === 'mask') {
      originalMask = v;
      replacedMasks = getAllMasks(v);
    } else {
      const originalAddress = parseInt(i.match(/mem\[([0-9]+)\]/)[1], 10);
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
