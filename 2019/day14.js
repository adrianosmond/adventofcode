import { readInput, splitAndMapInputLines } from '../utils/functions.js';

const input = readInput();

const parseInputChem = (str) => {
  const [q, e] = str.split(' ');
  return [parseInt(q, 10), e];
};

const instructions = splitAndMapInputLines(input, ' => ')
  .map(([inp, out]) => {
    const [quantity, chemical] = parseInputChem(out);
    const i = {
      chemical,
      quantity,
      inputs: {},
    };

    inp
      .split(', ')
      .map(parseInputChem)
      .forEach(([q, c]) => {
        i.inputs[c] = q;
      });

    return i;
  })
  .reduce(
    (all, { chemical, ...rest }) => ({
      ...all,
      [chemical]: { ...rest },
    }),
    {},
  );

const getDepth = (chemical) => {
  const { inputs } = instructions[chemical];
  if (inputs.ORE) {
    return 1;
  }
  const inputDepths = Object.keys(inputs).map((i) => getDepth(i));
  return 1 + Math.max(...inputDepths);
};

const depths = Object.keys(instructions)
  .map((c) => ({ [c]: getDepth(c) }))
  .reduce((all, curr) => {
    const [k, v] = Object.entries(curr)[0];
    return { ...all, [k]: v };
  }, {});

const flattenInputs = (inputs) => {
  let flatInputs = [];
  inputs.forEach((arr) => {
    if (Array.isArray(arr[0])) {
      flatInputs = [...flatInputs, ...arr];
    } else {
      flatInputs = [...flatInputs, arr];
    }
  });
  return flatInputs;
};

const consolidateChemicals = (inputs) => {
  const consolidated = [];
  inputs.forEach(([c, q]) => {
    const idx = consolidated.findIndex((i) => i[0] === c);
    if (idx < 0) {
      consolidated.push([c, q]);
    } else {
      consolidated[idx][1] += q;
    }
  });
  return consolidated;
};

const multiplyAmounts = (inputs, amount) =>
  Object.entries(inputs).map(([c, q]) => [c, q * amount]);

const getQuantityNeeded = (amountOfFuel) => {
  let inputs = multiplyAmounts(instructions.FUEL.inputs, amountOfFuel);
  while (inputs.length > 1) {
    const currentDepths = inputs.map(([c]) => depths[c]);
    const maxDepth = Math.max(...currentDepths);
    inputs = inputs.map(([c, q], index) => {
      if (currentDepths[index] < maxDepth) {
        return [c, q];
      }
      const quantityProduced = instructions[c].quantity;
      const multiple = Math.ceil(q / quantityProduced);
      return multiplyAmounts(instructions[c].inputs, multiple);
    });
    inputs = flattenInputs(inputs);
    inputs = consolidateChemicals(inputs);
  }

  return inputs[0][1];
};
const oreForOneFuel = getQuantityNeeded(1);
console.log('part1:', oreForOneFuel);

const target = 1000000000000;
let lower = 1;
let upper = target;
while (upper !== lower) {
  const mid = Math.round((upper + lower) / 2);
  const oreNeeded = getQuantityNeeded(mid);
  if (oreNeeded === target) {
    upper = mid;
    lower = mid;
  } else if (upper - lower === 1) {
    if (mid === upper) {
      upper = lower;
    } else {
      lower = upper;
    }
  } else if (oreNeeded > target) {
    upper = mid;
  } else {
    lower = mid;
  }
}

console.log('part2:', lower);
