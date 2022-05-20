const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input07.txt'), 'utf8');
const instructions = input.split('\n').map((r) => r.split(' -> '));

const numberOrString = (val) =>
  Number.isNaN(parseInt(val, 10)) ? val : parseInt(val, 10);

const makeMap = () => {
  const map = {};
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

const buildCircuit = (map) => {
  let changed = true;
  while (changed) {
    changed = false;
    Object.entries(map).forEach(([key, val]) => {
      if (typeof val === 'number') return;

      if (
        val.type === 'AND' &&
        typeof map[val.x] === 'number' &&
        typeof map[val.y] === 'number'
      ) {
        map[key] = map[val.x] & map[val.y];
        changed = true;
      } else if (
        val.type === 'AND' &&
        typeof val.x === 'number' &&
        typeof map[val.y] === 'number'
      ) {
        map[key] = val.x & map[val.y];
        changed = true;
      } else if (
        val.type === 'OR' &&
        typeof map[val.x] === 'number' &&
        typeof map[val.y] === 'number'
      ) {
        map[key] = map[val.x] | map[val.y];
        changed = true;
      } else if (val.type === 'LSHIFT' && typeof map[val.x] === 'number') {
        map[key] = map[val.x] << val.y;
        changed = true;
      } else if (val.type === 'RSHIFT' && typeof map[val.x] === 'number') {
        map[key] = map[val.x] >> val.y;
        changed = true;
      } else if (val.type === 'NOT' && typeof map[val.x] === 'number') {
        map[key] = 65535 - map[val.x];
        changed = true;
      } else if (val.type === 'VAL' && typeof map[val.x] === 'number') {
        map[key] = map[val.x];
        changed = true;
      }
    });
  }
  return map.a;
};

const part1 = () => buildCircuit(makeMap());

const answer1 = part1();

const part2 = () => {
  const map = makeMap();
  map.b = answer1;
  return buildCircuit(map);
};

console.log('part1', answer1);
console.log('part2', part2());
