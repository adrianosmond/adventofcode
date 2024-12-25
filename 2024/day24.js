import readInput from '../utils/readInput.js';

const input = readInput();
const circuit = {};

const [i, c] = input.split('\n\n');
i.split('\n').forEach((l) => {
  const [, inp, val] = l.match(/([a-z]\d+): (0|1)/);
  circuit[inp] = parseInt(val, 10);
});
c.split('\n').forEach((l) => {
  const [, inp1, op, inp2, out] = l.match(
    /([a-z0-9]+) (AND|OR|XOR) ([a-z0-9]+) -> ([a-z0-9]+)/,
  );
  circuit[out] = [op, inp1, inp2];
});

const makeWire = (xyz, num) => `${xyz}${num.toString().padStart(2, '0')}`;

const getVal = (wire) => {
  if (typeof circuit[wire] === 'number') return circuit[wire];
  const [op, w1, w2] = circuit[wire];
  let val;
  if (op === 'AND') val = getVal(w1) & getVal(w2);
  else if (op === 'OR') val = getVal(w1) | getVal(w2);
  else if (op === 'XOR') val = getVal(w1) ^ getVal(w2);
  return val;
};

const setXAndY = (x, y) => {
  const xStr = x.toString(2).padStart(45, '0');
  const yStr = y.toString(2).padStart(45, '0');
  for (let j = 0; j < xStr.length; j++) {
    circuit[makeWire('x', j)] = parseInt(xStr[xStr.length - 1 - j], 10);
    circuit[makeWire('y', j)] = parseInt(yStr[yStr.length - 1 - j], 10);
  }
};

const testAddition = (x, y) => {
  setXAndY(x, y);

  let str = '';
  for (let j = 0; true; j++) {
    const wire = makeWire('z', j);
    if (typeof circuit[wire] === 'undefined') break;
    str = getVal(wire) + str;
  }

  return BigInt(parseInt(str, 2)) === x + y;
};

const findSuspiciousBits = () => {
  const bits = [];
  for (let a = 0n; a < 45n; a++) {
    if (!testAddition(1n, 1n << a)) {
      bits.push(Number(a));
    }
  }
  return bits;
};

const findSwappables = (wire, depth = 0, includeSelf = false) => {
  // There isn't much point going deep into recursive wires as
  // if they were problematic they'd show up on earlier bits
  if (depth > 3) return [];
  if (wire.startsWith('x') || wire.startsWith('y')) return [];
  const [, w1, w2] = circuit[wire];
  return [
    ...(includeSelf ? [wire] : []),
    ...findSwappables(w1, depth + 1, true),
    ...findSwappables(w2, depth + 1, true),
  ];
};

const findPossibleSwaps = (badBits) => {
  const possibleSwaps = [];

  for (const b of badBits) {
    const swappables = [
      makeWire('z', b),
      ...findSwappables(makeWire('z', b + 1)),
    ];
    const bn = BigInt(b);
    possibleSwaps.push([]);

    for (let s1 = 0; s1 < swappables.length; s1++) {
      const w1 = swappables[s1];
      for (let s2 = s1 + 1; s2 < swappables.length; s2++) {
        const w2 = swappables[s2];

        const temp = circuit[w1];
        circuit[w1] = circuit[w2];
        circuit[w2] = temp;
        try {
          if (testAddition(1n, 1n << bn) && testAddition(1n << bn, 1n << bn)) {
            possibleSwaps.at(-1).push([w1, w2]);
          }
        } catch (e) {
          // Bad swaps can cause infinite loops in circuits
          // If we hit a max call stack exceeded error then just move on
        }
        circuit[w2] = circuit[w1];
        circuit[w1] = temp;
      }
    }
  }

  return possibleSwaps;
};

const findActualSwaps = (candidates, testing, badBits) => {
  const [candidate, ...rest] = candidates;
  for (const [w1, w2] of candidate) {
    const temp = circuit[w1];
    circuit[w1] = circuit[w2];
    circuit[w2] = temp;

    if (rest.length === 0) {
      let valid = true;

      for (const b of badBits) {
        const bMax = BigInt(2 ** (b + 1) - 1);
        valid = valid && testAddition(bMax, bMax) && testAddition(bMax, 1n);
      }

      if (valid) return [...testing, w1, w2];
    } else {
      const result = findActualSwaps(rest, [...testing, w1, w2], badBits);
      if (result) return result;
    }

    circuit[w2] = circuit[w1];
    circuit[w1] = temp;
  }
};

export const part1 = () => {
  let output = '';
  for (let z = 0; true; z++) {
    const bit = makeWire('z', z);
    if (typeof circuit[bit] === 'undefined') break;
    output = getVal(bit) + output;
  }

  return parseInt(output, 2);
};

// I don't know if this will work for all inputs. I read about the
// right way to solve this but having learned that it didn't seem
// interesting to me to copy someone else's adder verifier algorithm
// just to get a star. Instead I decided to try to brute force the
// solution with a little intelligence as I figured it might be
// a little interesting to see if I could get it to run fast-ish
export const part2 = () => {
  const badBits = findSuspiciousBits();
  const candidates = findPossibleSwaps(badBits);
  const swaps = findActualSwaps(candidates, [], badBits);
  return swaps.sort().join(',');
};
