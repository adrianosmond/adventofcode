import readInput from '../utils/readInput.js';
import { product } from '../utils/reducers.js';

const input = readInput();

const blueprints = input
  .split('\n')
  .map((line) =>
    Object.fromEntries(
      Object.entries(
        line.match(
          /Blueprint \d+: Each ore robot costs (?<ore>\d+) ore. Each clay robot costs (?<clayOre>\d+) ore. Each obsidian robot costs (?<obsidianOre>\d+) ore and (?<obsidianClay>\d+) clay. Each geode robot costs (?<geodeOre>\d+) ore and (?<geodeObsidian>\d+) obsidian./,
        ).groups,
      ).map(([k, v]) => [k, parseInt(v, 10)]),
    ),
  );

const initialState = {
  time: 1,
  ore: 1,
  orePerMinute: 1,
  clay: 0,
  clayPerMinute: 0,
  obsidian: 0,
  obsidianPerMinute: 0,
  geodes: 0,
  geodesPerMinute: 0,
};

const getNextState = (state, timeDiff) => ({
  ...state,
  time: state.time + timeDiff,
  ore: state.ore + timeDiff * state.orePerMinute,
  clay: state.clay + timeDiff * state.clayPerMinute,
  obsidian: state.obsidian + timeDiff * state.obsidianPerMinute,
  geodes: state.geodes + timeDiff * state.geodesPerMinute,
});

const timeToResource = (target, stock, production) =>
  1 + Math.max(0, Math.ceil((target - stock) / production));

const findMostGeodes = (blueprint, state, timeLimit, best = 0) => {
  if (state.time === timeLimit) {
    return state.geodes;
  }

  let theoreticalBest = state.geodes;
  let theoreticalBestProduction = state.geodesPerMinute;
  for (let i = state.time; i <= timeLimit; i++) {
    theoreticalBest += theoreticalBestProduction;
    theoreticalBestProduction++;
  }
  if (theoreticalBest < best) {
    return best;
  }

  const maxOre = Math.max(
    blueprint.ore,
    blueprint.clayOre,
    blueprint.obsidianOre,
    blueprint.geodeOre,
  );
  const maxClay = blueprint.obsidianClay;
  const maxObsidian = blueprint.geodeObsidian;

  if (state.obsidianPerMinute > 0) {
    // get a geode collecting robot
    const timeToGeodeRobotOre = timeToResource(
      blueprint.geodeOre,
      state.ore,
      state.orePerMinute,
    );
    const timeToGeodeRobotObsidian = timeToResource(
      blueprint.geodeObsidian,
      state.obsidian,
      state.obsidianPerMinute,
    );
    const timeToGeodeRobot = Math.max(
      timeToGeodeRobotOre,
      timeToGeodeRobotObsidian,
    );

    if (state.time + timeToGeodeRobot <= timeLimit) {
      const nextState = getNextState(state, timeToGeodeRobot);
      nextState.geodesPerMinute++;
      nextState.ore -= blueprint.geodeOre;
      nextState.obsidian -= blueprint.geodeObsidian;
      best = Math.max(
        best,
        findMostGeodes(blueprint, nextState, timeLimit, best),
      );
    }
  }

  if (state.clayPerMinute > 0 && state.obsidianPerMinute < maxObsidian) {
    // get an obsidian collecting robot
    const timeToObsidianRobotOre = timeToResource(
      blueprint.obsidianOre,
      state.ore,
      state.orePerMinute,
    );
    const timeToObsidianRobotClay = timeToResource(
      blueprint.obsidianClay,
      state.clay,
      state.clayPerMinute,
    );
    const timeToObsidianRobot = Math.max(
      timeToObsidianRobotOre,
      timeToObsidianRobotClay,
    );
    if (state.time + timeToObsidianRobot <= timeLimit) {
      const nextState = getNextState(state, timeToObsidianRobot);
      nextState.obsidianPerMinute++;
      nextState.ore -= blueprint.obsidianOre;
      nextState.clay -= blueprint.obsidianClay;
      best = Math.max(
        best,
        findMostGeodes(blueprint, nextState, timeLimit, best),
      );
    }
  }

  if (state.clayPerMinute < maxClay) {
    const timeToClayRobot = timeToResource(
      blueprint.clayOre,
      state.ore,
      state.orePerMinute,
    );
    if (state.time + timeToClayRobot <= timeLimit) {
      const nextState = getNextState(state, timeToClayRobot);
      nextState.clayPerMinute++;
      nextState.ore -= blueprint.clayOre;
      best = Math.max(
        best,
        findMostGeodes(blueprint, nextState, timeLimit, best),
      );
    }
  }

  if (state.orePerMinute < maxOre) {
    const timeToOreRobot = timeToResource(
      blueprint.ore,
      state.ore,
      state.orePerMinute,
    );
    if (state.time + timeToOreRobot <= timeLimit) {
      const nextState = getNextState(state, timeToOreRobot);
      nextState.orePerMinute++;
      nextState.ore -= blueprint.ore;
      best = Math.max(
        best,
        findMostGeodes(blueprint, nextState, timeLimit, best),
      );
    }
  }

  return Math.max(
    best,
    state.geodes + (timeLimit - state.time) * state.geodesPerMinute,
  );
};

const part1 = () =>
  blueprints
    .map((blueprint) => findMostGeodes(blueprint, initialState, 24))
    .reduce((a, b, idx) => a + b * (idx + 1));

const part2 = () =>
  blueprints
    .slice(0, 3)
    .map((blueprint, idx) => {
      const result = findMostGeodes(blueprint, initialState, 32);
      console.log(` - ${idx + 1} / 3 complete`);
      return result;
    })
    .reduce(product);

console.log('part1', part1());
console.log('This is going to take a little while...');
console.log('part2', part2());
