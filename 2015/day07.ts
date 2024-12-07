import readInput from '../utils/readInput.ts';
import { splitAndMapInputLines } from '../utils/functions.ts';

const input = readInput();
const instructions = splitAndMapInputLines(input, ' -> ');

const numberOrString = (val: string) =>
  Number.isNaN(parseInt(val, 10)) ? val : parseInt(val, 10);

type Instruction = {
  type: string;
  x: number | string;
  y?: number | string;
};
type MapValue = number | Instruction;

const num = (v: unknown): number => {
  if (typeof v !== 'number') throw new Error('Expected number');
  return v;
};

const makeMap = (): Record<string, MapValue> => {
  const map: Record<string, MapValue> = {};
  instructions.forEach(([inp, out]) => {
    if (inp.includes(' AND ')) {
      const [x, y] = inp.split(' AND ');
      map[out] = {
        type: 'AND',
        x: numberOrString(x),
        y: numberOrString(y),
      };
    } else if (inp.includes(' OR ')) {
      const [x, y] = inp.split(' OR ');
      map[out] = {
        type: 'OR',
        x: numberOrString(x),
        y: numberOrString(y),
      };
    } else if (inp.includes(' LSHIFT ')) {
      const [x, y] = inp.split(' LSHIFT ');
      map[out] = {
        type: 'LSHIFT',
        x,
        y: parseInt(y, 10),
      };
    } else if (inp.includes(' RSHIFT ')) {
      const [x, y] = inp.split(' RSHIFT ');
      map[out] = {
        type: 'RSHIFT',
        x,
        y: parseInt(y, 10),
      };
    } else if (inp.includes('NOT ')) {
      const x = inp.replace('NOT ', '');
      map[out] = {
        type: 'NOT',
        x,
      };
    } else if (!Number.isNaN(parseInt(inp, 10))) {
      map[out] = parseInt(inp, 10);
    } else {
      map[out] = {
        type: 'VAL',
        x: inp,
      };
    }
  });
  return map;
};

const buildCircuit = (map: Record<string, MapValue>) => {
  let changed = true;
  while (changed) {
    changed = false;
    Object.entries(map).forEach(([key, val]) => {
      if (typeof val === 'number') return;

      if (
        val.type === 'AND' &&
        typeof map[val.x] === 'number' &&
        typeof val.y !== 'undefined' &&
        typeof map[val.y] === 'number'
      ) {
        map[key] = num(map[val.x]) & num(map[val.y]);
        changed = true;
      } else if (
        val.type === 'AND' &&
        typeof val.x === 'number' &&
        typeof val.y !== 'undefined' &&
        typeof map[val.y] === 'number'
      ) {
        map[key] = val.x & num(map[val.y]);
        changed = true;
      } else if (
        val.type === 'OR' &&
        typeof map[val.x] === 'number' &&
        typeof val.y !== 'undefined' &&
        typeof map[val.y] === 'number'
      ) {
        map[key] = num(map[val.x]) | num(map[val.y]);
        changed = true;
      } else if (val.type === 'LSHIFT' && typeof map[val.x] === 'number') {
        map[key] = num(map[val.x]) << num(val.y);
        changed = true;
      } else if (val.type === 'RSHIFT' && typeof map[val.x] === 'number') {
        map[key] = num(map[val.x]) >> num(val.y);
        changed = true;
      } else if (val.type === 'NOT' && typeof map[val.x] === 'number') {
        map[key] = 65535 - num(map[val.x]);
        changed = true;
      } else if (val.type === 'VAL' && typeof map[val.x] === 'number') {
        map[key] = num(map[val.x]);
        changed = true;
      }
    });
  }
  return map.a;
};

export const part1 = () => buildCircuit(makeMap());

export const part2 = () => {
  const map = makeMap();
  map.b = part1();
  return buildCircuit(map);
};
