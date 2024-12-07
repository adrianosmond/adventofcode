import readInput from '../utils/readInput.ts';
import { splitAndMapInputLines } from '../utils/functions.ts';

const input = readInput();

type Instruction = {
  chemical: string;
  quantity: number;
  inputs: Record<string, number>;
};

const parseInputChem = (str: string): [number, string] => {
  const [q, e] = str.split(' ');
  return [parseInt(q, 10), e];
};

const instructions: Record<
  string,
  Omit<Instruction, 'chemical'>
> = splitAndMapInputLines(input, ' => ')
  .map(([inp, out]) => {
    const [quantity, chemical] = parseInputChem(out);
    const i: Instruction = {
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
  .reduce<Record<string, Omit<Instruction, 'chemical'>>>(
    (all, { chemical, ...rest }) => ({
      ...all,
      [chemical]: { ...rest },
    }),
    {},
  );

const getDepth = (chemical: string): number => {
  const { inputs } = instructions[chemical];
  if (inputs.ORE) {
    return 1;
  }
  const inputDepths: number[] = Object.keys(inputs).map((i) => getDepth(i));
  return 1 + Math.max(...inputDepths);
};

const depths = Object.keys(instructions)
  .map((c) => ({ [c]: getDepth(c) }))
  .reduce((all, curr) => {
    const [k, v] = Object.entries(curr)[0];
    return { ...all, [k]: v };
  }, {});

type ChemAmount = [string, number];

const isChemAmountArray = (
  arr: ChemAmount | ChemAmount[],
): arr is ChemAmount[] => Array.isArray(arr[0]);

const flattenInputs = (inputs: (ChemAmount | ChemAmount[])[]): ChemAmount[] => {
  let flatInputs: ChemAmount[] = [];
  inputs.forEach((arr) => {
    if (isChemAmountArray(arr)) {
      flatInputs = [...flatInputs, ...arr];
    } else {
      flatInputs = [...flatInputs, arr];
    }
  });
  return flatInputs;
};

const consolidateChemicals = (inputs: ChemAmount[]): ChemAmount[] => {
  const consolidated: ChemAmount[] = [];
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

const multiplyAmounts = (
  inputs: Record<string, number>,
  amount: number,
): ChemAmount[] => Object.entries(inputs).map(([c, q]) => [c, q * amount]);

const getQuantityNeeded = (amountOfFuel: number): number => {
  let inputs: ChemAmount[] = multiplyAmounts(
    instructions.FUEL.inputs,
    amountOfFuel,
  );
  while (inputs.length > 1) {
    const currentDepths = inputs.map(([c]) => depths[c]);
    const maxDepth = Math.max(...currentDepths);
    const mapped = inputs.map<ChemAmount | ChemAmount[]>(([c, q], index) => {
      if (currentDepths[index] < maxDepth) {
        return [c, q];
      }
      const quantityProduced = instructions[c].quantity;
      const multiple = Math.ceil(q / quantityProduced);
      return multiplyAmounts(instructions[c].inputs, multiple);
    });
    inputs = flattenInputs(mapped);
    inputs = consolidateChemicals(inputs);
  }

  return inputs[0][1];
};

export const part1 = () => getQuantityNeeded(1);

export const part2 = () => {
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
  return lower;
};
