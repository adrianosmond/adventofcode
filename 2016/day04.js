import readInput from '../utils/readInput.js';
import { sumByKey, mergeObjects } from '../utils/reducers.js';

const input = readInput();

const processRoom = (str) => {
  const [, name, id, checksum] = str.match(/([a-z-]+)(\d+)\[([a-z]{5})\]/);
  return {
    name,
    sectorId: parseInt(id, 10),
    checksum,
  };
};

const rooms = input.split('\n').map(processRoom);

const checkRoom = (room) => {
  const letters = room.name.replace(/-/g, '').split('').sort();

  const individualLetters = letters
    .join('')
    .replace(/(.)(?=.*\1)/g, '')
    .split('');

  const freq = individualLetters
    .map((letter) => ({
      [letter]: letters.filter((l) => l === letter).length,
    }))
    .reduce(mergeObjects, {});

  individualLetters.sort((a, b) =>
    freq[a] === freq[b] ? a.charCodeAt(0) - b.charCodeAt(0) : freq[b] - freq[a],
  );

  return individualLetters.join('').substr(0, 5) === room.checksum;
};

const decryptRoomName = ({ name, sectorId }) =>
  name
    .split('')
    .map((char) => {
      if (char === '-') {
        return ' ';
      }
      let code = char.charCodeAt(0) + (sectorId % 26);
      if (code > 122) code -= 26;
      return String.fromCharCode(code);
    })
    .join('');

const realRooms = rooms.filter(checkRoom);

export const part1 = () => realRooms.reduce(sumByKey('sectorId'), 0);

export const part2 = () => {
  for (const room of realRooms) {
    const realName = decryptRoomName(room);
    if (realName.includes('north')) {
      return room.sectorId;
    }
  }
};
