import readInput from '../utils/readInput.ts';

const input = readInput();

const instructions = input.split('\n');

type Bot = {
  inputs: number[];
  low: { type: string; id: number } | null;
  high: { type: string; id: number } | null;
};

const bots: Record<number, Bot> = {};
const outputs: Record<number, number[]> = {};
const newBot = (): Bot => ({ inputs: [], low: null, high: null });
const toResolve: number[] = [];
let botNumber = -1;

const resolveInputs = () => {
  while (toResolve.length > 0) {
    const botId = toResolve.shift()!;
    const bot = bots[botId];
    if (bot.inputs.includes(17) && bot.inputs.includes(61)) {
      botNumber = botId;
    }
    const min = Math.min(...bot.inputs);
    const max = Math.max(...bot.inputs);
    if (bot.low?.type === 'output') {
      const { id } = bot.low;
      if (!outputs[id]) {
        outputs[id] = [];
      }
      outputs[id].push(min);
    } else if (bot.low?.type === 'bot') {
      bots[bot.low.id].inputs.push(min);
      if (bots[bot.low.id].inputs.length === 2) {
        toResolve.push(bot.low.id);
      }
    }
    if (bot.high?.type === 'output') {
      const { id } = bot.high;
      if (!outputs[id]) {
        outputs[id] = [];
      }
      outputs[id].push(max);
    } else if (bot.high?.type === 'bot') {
      bots[bot.high.id].inputs.push(max);
      if (bots[bot.high.id].inputs.length === 2) {
        toResolve.push(bot.high.id);
      }
    }

    bot.inputs = [];
  }
};

instructions.forEach((i) => {
  if (!i.startsWith('value')) {
    const [, bot, type1, id1, type2, id2] = i.match(
      /bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)/,
    )!;
    const botId = parseInt(bot, 10);
    bots[botId] = newBot();
    bots[botId].low = { type: type1, id: parseInt(id1, 10) };
    bots[botId].high = { type: type2, id: parseInt(id2, 10) };
  }
});

instructions.forEach((i) => {
  if (i.startsWith('value')) {
    const [, val, bot] = i.match(/value (\d+) goes to bot (\d+)/)!;
    const botId = parseInt(bot, 10);
    bots[botId].inputs.push(parseInt(val, 10));
    if (bots[botId].inputs.length === 2) {
      toResolve.push(botId);
      resolveInputs();
    }
  }
});

export const part1 = () => botNumber;

export const part2 = () => outputs['0'][0] * outputs['1'][0] * outputs['2'][0];
