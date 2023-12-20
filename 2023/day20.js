import { lcm, readInput, splitAndMapInputLines } from '../utils/functions.js';

const input = readInput();

const getInitialConfig = (machine) => {
  if (machine === 'broadcaster') return { type: machine };
  if (machine[0] === '%')
    return {
      type: 'flip',
      isOn: false,
    };
  return {
    type: 'conjunction',
    inputs: {},
  };
};

const modules = Object.fromEntries(
  splitAndMapInputLines(input, ' -> ').map(([machine, destinations]) => {
    const key = machine === 'broadcaster' ? machine : machine.substring(1);
    const values = {
      ...getInitialConfig(machine),
      destinations: destinations.split(', '),
    };
    return [key, values];
  }),
);

Object.entries(modules)
  .filter(([, config]) => config.type === 'conjunction')
  .forEach(([name, config]) => {
    Object.entries(modules)
      .filter(([, b]) => b.destinations.some((d) => d === name))
      .forEach(([a]) => {
        config.inputs[a] = 0;
      });
  });

const getAncestors = (node) => {
  const parent = Object.entries(modules).find(
    ([, config]) => config.destinations[0] === node,
  )[0];
  return [
    parent,
    Object.entries(modules)
      .filter(([, config]) => config.destinations[0] === parent)
      .map(([name]) => name),
  ];
};

let pushes = 1;
const pushButtons = (numPushes, part2) => {
  const [rxParent, rxGrandparents] = getAncestors('rx');
  const cycleLengths = Object.fromEntries(
    rxGrandparents.map((node) => [node, false]),
  );

  const pulses = [0, 0];
  while (pushes <= numPushes) {
    const queue = [['broadcaster', 0, 'button']];

    while (queue.length > 0) {
      const [name, pulse, source] = queue.shift();
      if (part2 && name === rxParent && pulse === 1 && !cycleLengths[source]) {
        cycleLengths[source] = pushes;
        // If we've found the cycle lengths for each grandparent,
        // the answer for part 2 will be their lcm
        if (Object.values(cycleLengths).every(Boolean)) {
          return lcm(Object.values(cycleLengths));
        }
      }
      pulses[pulse]++;
      const module = modules[name];
      if (!module) continue;
      if (module.type === 'broadcaster') {
        module.destinations.forEach((dest) => queue.push([dest, pulse, name]));
      } else if (module.type === 'flip' && pulse === 0) {
        if (module.isOn) {
          module.destinations.forEach((dest) => queue.push([dest, 0, name]));
          module.isOn = false;
        } else {
          module.destinations.forEach((dest) => queue.push([dest, 1, name]));
          module.isOn = true;
        }
      } else if (module.type === 'conjunction') {
        module.inputs[source] = pulse;
        if (Object.values(module.inputs).some((v) => v === 0)) {
          module.destinations.forEach((dest) => queue.push([dest, 1, name]));
        } else {
          module.destinations.forEach((dest) => queue.push([dest, 0, name]));
        }
      }
    }

    pushes++;
  }

  // return for part 1
  return pulses[0] * pulses[1];
};

const part1 = () => pushButtons(1000);

const part2 = () => pushButtons(Number.MAX_SAFE_INTEGER, true);

console.log('part1', part1());
console.log('part2', part2());
