import readInput from '../utils/readInput.js';

const input = readInput();

const [diagram, instructions] = input.split('\n\n');
const layers = diagram.split('\n').reverse();
layers.shift();

const makeStacks = () => {
  const stacks = [];
  layers.forEach((layer) => {
    for (let i = 1; i < layer.length; i += 4) {
      const stackIdx = Math.floor(i / 4);
      if (!stacks[stackIdx]) stacks[stackIdx] = [];
      if (layer[i] !== ' ') stacks[stackIdx].push(layer[i]);
    }
  });
  return stacks;
};

const indices = instructions.split('\n').map((p) => {
  const [, count, from, to] = p.match(/move (\d+) from (\d+) to (\d+)/);
  return [parseInt(count, 10), parseInt(from, 10) - 1, parseInt(to, 10) - 1];
});

const part1 = () => {
  const stacks = makeStacks();
  indices.forEach(([count, from, to]) => {
    for (let i = 0; i < count; i++) {
      const item = stacks[from].pop();
      stacks[to].push(item);
    }
  });
  return stacks.map((s) => s[s.length - 1]).join('');
};

const part2 = () => {
  const stacks = makeStacks();
  indices.forEach(([count, from, to]) => {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.unshift(stacks[from].pop());
    }
    stacks[to].push(...items);
  });
  return stacks.map((s) => s[s.length - 1]).join('');
};

console.log('part1', part1());
console.log('part2', part2());
