import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';
import { sum } from '../utils/reducers.ts';

const input = readInput();
const sizes = strToIntArray(input, '');
const diskSize = sizes.reduce(sum);
const EMPTY = -1;

const makeDisk = () => {
  const disk = new Array(diskSize).fill(EMPTY);
  const files = [];
  const spaces = [];
  let ptr = 0;
  let fileId = 0;
  for (let i = 0; i < sizes.length; i++) {
    if (i % 2 === 0) {
      files.push({ start: ptr, size: sizes[i] });
      for (let j = 0; j < sizes[i]; j++) {
        disk[ptr] = fileId;
        ptr++;
      }
      fileId++;
    } else {
      spaces.push({ start: ptr, size: sizes[i] });
      ptr += sizes[i];
    }
  }
  return [disk, files, spaces];
};

const makeChecksum = (disk: number[]) =>
  disk.reduce(
    (checksum, val, idx) => checksum + (val === EMPTY ? 0 : val) * idx,
    0,
  );

export const part1 = () => {
  const [disk] = makeDisk();
  let lPtr = 0;
  let rPtr = diskSize - 1;
  while (disk[lPtr] !== EMPTY) lPtr++;
  while (lPtr < rPtr) {
    disk[lPtr] = disk[rPtr];
    lPtr++;
    while (disk[lPtr] !== EMPTY) lPtr++;
    disk[rPtr] = EMPTY;
    rPtr--;
    while (disk[rPtr] === EMPTY) rPtr--;
  }

  return makeChecksum(disk);
};

export const part2 = () => {
  const [disk, files, spaces] = makeDisk();
  for (let fileId = files.length - 1; fileId > 0; fileId--) {
    const fileSize = files[fileId].size;
    let spaceIdx = 0;
    while (spaceIdx < spaces.length) {
      if (
        spaces[spaceIdx].size >= fileSize && // space is big enough
        spaces[spaceIdx].start < files[fileId].start // moving file to the left
      ) {
        for (let i = 0; i < fileSize; i++) {
          disk[files[fileId].start + i] = EMPTY;
          disk[spaces[spaceIdx].start + i] = fileId;
        }
        spaces[spaceIdx].start += fileSize;
        spaces[spaceIdx].size -= fileSize;
        break;
      }
      spaceIdx++;
    }
  }

  return makeChecksum(disk);
};
