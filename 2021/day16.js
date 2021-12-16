/* eslint-disable no-use-before-define */
const fs = require('fs');
const path = require('path');
const { hexToBinaryStr } = require('../utils/functions');
const { sum, product } = require('../utils/reducers');

const input = fs.readFileSync(path.resolve(__dirname, 'input16.txt'), 'utf8');
const binary = hexToBinaryStr(input);

const parseLiteral = (litStr) => {
  let end = 6;
  let val = '';
  while (true) {
    const isLast = litStr[end] === '0';
    val += litStr.substring(end + 1, end + 5);
    end += 5;
    if (isLast) {
      return [[], end, parseInt(val, 2)];
    }
  }
};

const parseOperator = (opStr) => {
  const lengthTypeId = opStr.substring(6, 7);
  if (lengthTypeId === '0') {
    const lenSubPackets = parseInt(opStr.substring(7, 22), 2);
    const end = 22 + lenSubPackets;
    const subPackets = makePackets(opStr.substring(22, end));
    return [subPackets, end];
  }
  const numSubPackets = parseInt(opStr.substring(7, 18), 2);
  const subPackets = makePackets(opStr.substring(18), numSubPackets);
  return [subPackets, 18 + subPackets.map((s) => s.length).reduce(sum)];
};

const makePackets = (toParse, maxPackets = Number.MAX_SAFE_INTEGER) => {
  const packets = [];
  while (packets.length < maxPackets && toParse.length > 0) {
    const packet = parsePacket(toParse);
    packets.push(packet);
    toParse = toParse.substring(packet.length);
    if (toParse.match(/^[0]+$/)) break;
  }
  return packets;
};

const parsePacket = (packetStr) => {
  const version = parseInt(packetStr.substring(0, 3), 2);
  const type = parseInt(packetStr.substring(3, 6), 2);
  const [subPackets, length, value] =
    type === 4 ? parseLiteral(packetStr) : parseOperator(packetStr);

  return {
    version,
    type,
    subPackets,
    length,
    value,
  };
};

const sumVersionNumbers = (packets) =>
  packets.reduce(
    (total, packet) =>
      total + packet.version + sumVersionNumbers(packet.subPackets),
    0,
  );

const getValue = (packet) => {
  const values = packet.subPackets.map((s) =>
    typeof s.value === 'number' ? s.value : getValue(s),
  );
  switch (packet.type) {
    case 0:
      return values.reduce(sum, 0);
    case 1:
      return values.reduce(product, 1);
    case 2:
      return Math.min(...values);
    case 3:
      return Math.max(...values);
    case 5:
      return values[0] > values[1] ? 1 : 0;
    case 6:
      return values[0] < values[1] ? 1 : 0;
    case 7:
      return values[0] === values[1] ? 1 : 0;
    default:
      throw new Error('Unexpected type found');
  }
};

const packet = parsePacket(binary);

const part1 = () => sumVersionNumbers([packet]);

const part2 = () => getValue(packet);

console.log('part1', part1());
console.log('part2', part2());
