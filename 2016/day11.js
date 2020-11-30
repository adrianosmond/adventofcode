const input = require('./input11');

const maxFloor = 3;
const initialState = {
  elev: 0,
};

input.split('\n').forEach((floor, idx) => {
  if (!floor.includes('nothing relevant')) {
    floor
      .match(/([^\s]+) (generator|microchip)/g)
      .map((s) =>
        s
          .replace('-compatible', '')
          .split(' ')
          .map((w) => w.substr(0, 2))
          .join(''),
      )
      .forEach((name) => {
        initialState[name] = idx;
      });
  }
});

const getItemsOnLevel = (state, level) =>
  Object.keys(state).filter((i) => i !== 'elev' && state[i] === level);

const getMicrochips = (items) => items.filter((i) => i.endsWith('mi'));
const getGenerators = (items) => items.filter((i) => i.endsWith('ge'));

const isLegalState = (state) => {
  for (let i = 0; i <= maxFloor; i++) {
    const items = getItemsOnLevel(state, i);
    const generators = getGenerators(items);
    if (generators.length === 0) continue;
    const microchips = getMicrochips(items);
    for (let j = 0; j < microchips.length; j++) {
      const generator = microchips[j].replace('mi', 'ge');
      if (!generators.includes(generator)) {
        return false;
      }
    }
  }
  return true;
};

const moveItems = (state, nextSteps, items, direction) => {
  const newState = { ...state };
  newState.elev += direction;
  items.forEach((i) => {
    newState[i] += direction;
  });
  if (isLegalState(newState)) {
    nextSteps.push(newState);
  }
};

const getNextSteps = (state) => {
  const nextSteps = [];
  const itemsBelow = [];
  for (let i = 0; i < state.elev; i++) {
    itemsBelow.push(...getItemsOnLevel(state, i));
  }
  const possibleItems = getItemsOnLevel(state, state.elev);
  const microchips = getMicrochips(possibleItems);
  const generators = getGenerators(possibleItems);
  const singlesToCarry = [];
  const doublesToCarry = [];

  for (let i = 0; i < microchips.length; i++) {
    const generator = microchips[i].replace('mi', 'ge');
    singlesToCarry.push([microchips[i]]);
    if (possibleItems.includes(generator)) {
      doublesToCarry.push([microchips[i], generator]);
    }
    for (let j = i + 1; j < microchips.length; j++) {
      doublesToCarry.push([microchips[i], microchips[j]]);
    }
  }

  for (let i = 0; i < generators.length; i++) {
    singlesToCarry.push([generators[i]]);
    for (let j = i + 1; j < generators.length; j++) {
      doublesToCarry.push([generators[i], generators[j]]);
    }
  }
  if (state.elev > 0 && itemsBelow.length > 0) {
    if (singlesToCarry.length) {
      singlesToCarry.forEach((item) => moveItems(state, nextSteps, item, -1));
    } else {
      doublesToCarry.forEach((item) => moveItems(state, nextSteps, item, -1));
    }
  }
  if (state.elev < maxFloor) {
    if (doublesToCarry.length) {
      doublesToCarry.forEach((item) => moveItems(state, nextSteps, item, 1));
    } else {
      singlesToCarry.forEach((item) => moveItems(state, nextSteps, item, 1));
    }
  }

  return nextSteps;
};

const makeKey = (steps) => JSON.stringify(steps);

const findSteps = (state) => {
  const queue = [state];
  const steps = {
    [makeKey(state)]: 0,
  };

  while (queue.length > 0) {
    const current = queue.shift();
    const currentKey = makeKey(current);
    const currentSteps = steps[currentKey];
    if (Object.values(current).every((v) => v === maxFloor)) {
      return currentSteps;
    }
    const nextSteps = getNextSteps(current);
    nextSteps.forEach((step) => {
      const keyStr = makeKey(step);
      if (typeof steps[keyStr] === 'undefined') {
        steps[keyStr] = currentSteps + 1;
        queue.push(step);
      }
    });
  }
  throw new Error('No route found');
};

console.log('part1:', findSteps(initialState));

const part2state = {
  ...initialState,
  elmi: 0,
  elge: 0,
  dimi: 0,
  dige: 0,
};

console.log('part2:', findSteps(part2state));
