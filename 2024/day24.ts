import readInput from '../utils/readInput.ts';

const input = readInput();
type OP = 'AND' | 'OR' | 'XOR';
const circuit: Record<string, number | [OP, string, string]> = {};

const [i, c] = input.split('\n\n');
i.split('\n').forEach((l) => {
  const [, inp, val] = l.match(/([a-z]\d+): (0|1)/)!;
  circuit[inp] = parseInt(val, 10);
});
c.split('\n').forEach((l) => {
  const [, inp1, op, inp2, out] = l.match(
    /([a-z0-9]+) (AND|OR|XOR) ([a-z0-9]+) -> ([a-z0-9]+)/,
  )!;
  circuit[out] = [op as OP, inp1, inp2];
});

const makeWire = (xyz: string, num: number) =>
  `${xyz}${num.toString().padStart(2, '0')}`;

const getVal = (wire: string): number => {
  if (typeof circuit[wire] === 'number') return circuit[wire];
  const [op, w1, w2] = circuit[wire];

  switch (op) {
    case 'AND':
      return getVal(w1) & getVal(w2);
    case 'OR':
      return getVal(w1) | getVal(w2);
    case 'XOR':
      return getVal(w1) ^ getVal(w2);
  }
};

const setXAndY = (x: bigint, y: bigint) => {
  const xStr = x.toString(2).padStart(45, '0');
  const yStr = y.toString(2).padStart(45, '0');
  for (let j = 0; j < xStr.length; j++) {
    circuit[makeWire('x', j)] = parseInt(xStr[xStr.length - 1 - j], 10);
    circuit[makeWire('y', j)] = parseInt(yStr[yStr.length - 1 - j], 10);
  }
};

const testAddition = (x: bigint, y: bigint) => {
  setXAndY(x, y);

  let str = '';
  for (let j = 0; ; j++) {
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

const findSwappables = (
  wire: string,
  depth = 0,
  includeSelf = false,
): string[] => {
  // There isn't much point going deep into recursive wires as
  // if they were problematic they'd show up on earlier bits
  if (depth > 3) return [];
  if (typeof circuit[wire] === 'number') return [];
  const [, w1, w2] = circuit[wire];
  return [
    ...(includeSelf ? [wire] : []),
    ...findSwappables(w1, depth + 1, true),
    ...findSwappables(w2, depth + 1, true),
  ];
};

const findPossibleSwaps = (badBits: number[]) => {
  const possibleSwaps: [string, string][][] = [];

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
            possibleSwaps.at(-1)!.push([w1, w2]);
          }
        } catch {
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

const findActualSwaps = (
  candidates: [string, string][][],
  testing: string[],
  badBits: number[],
): string[] | undefined => {
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
  for (let z = 0; ; z++) {
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
  if (!swaps) return "My brute force method didn't work for this input :(";
  return swaps.sort().join(',');
};
