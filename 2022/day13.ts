import readInput from '../utils/readInput.ts';
import { product, sum } from '../utils/reducers.ts';

const input = readInput();
const decoders = ['[[2]]', '[[6]]'];
const inputWithDecoders = `${input}\n${decoders.join('\n')}`.replace(
  /\n\n/g,
  '\n',
);

type PacketArray = Array<PacketArray | number>;

const packetOrder = (left: PacketArray, right: PacketArray): number => {
  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    const l = left[i];
    const r = right[i];
    if (typeof l === 'number' && typeof r === 'number') {
      if (l < r) return -1;
      if (r < l) return 1;
    } else {
      let result;
      if (Array.isArray(l) && Array.isArray(r)) {
        result = packetOrder(l, r);
      } else if (Array.isArray(l)) {
        result = packetOrder(l, [r]);
      } else {
        result = packetOrder([l], r as PacketArray);
      }
      if (result !== 0) return result;
    }
  }
  if (left.length < right.length) return -1;
  if (right.length < left.length) return 1;
  return 0;
};

export const part1 = () =>
  input
    .split('\n\n')
    .map((pair) => pair.split('\n').map((packet) => JSON.parse(packet)))
    .map(([l, r], index) => (packetOrder(l, r) < 0 ? index + 1 : 0))
    .reduce(sum);

export const part2 = () =>
  inputWithDecoders
    .split('\n')
    .map((packet) => JSON.parse(packet))
    .sort(packetOrder)
    .map((packet, index) =>
      decoders.includes(JSON.stringify(packet)) ? index + 1 : 0,
    )
    .filter(Boolean)
    .reduce(product);
