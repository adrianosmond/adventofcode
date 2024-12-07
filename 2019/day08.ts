import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';

const input = readInput();

const OUTPUT_CHARS = [' ', '#']; // Representing black and white pixels
const IMG_WIDTH = 25;
const IMG_HEIGHT = 6;
const PX_PER_LAYER = IMG_WIDTH * IMG_HEIGHT;
const ALL_ZEROS = { zeros: PX_PER_LAYER, score: 0 };
const TRANSPARENT_IMG = new Array(PX_PER_LAYER).fill(2);
const pixels = strToIntArray(input, '');
const numLayers = pixels.length / PX_PER_LAYER;

const layers = new Array(numLayers)
  .fill(0)
  .map((_, i) =>
    pixels.slice(i * PX_PER_LAYER, i * PX_PER_LAYER + PX_PER_LAYER),
  );

const getZerosAndScore = (layer: number[]) => ({
  zeros: layer.filter((x) => x === 0).length,
  score:
    layer.filter((x) => x === 1).length * layer.filter((x) => x === 2).length,
});

const chooseLayerWithFewestZeros = (
  best: { zeros: number; score: number },
  layer: { zeros: number; score: number },
) => (layer.zeros > best.zeros ? best : layer);

const overrideTransparentPixelsInImage = (img: number[], layer: number[]) =>
  img.map((px, i) => (px < 2 ? px : layer[i]));

const numbersToOutputChars = (px: number) => OUTPUT_CHARS[px];

const imgToMultiLineString = (img: string, px: string, idx: number) =>
  img + px + ((idx + 1) % IMG_WIDTH === 0 ? '\n' : '');

export const part1 = () =>
  layers.map(getZerosAndScore).reduce(chooseLayerWithFewestZeros, ALL_ZEROS)
    .score;

export const part2 = () =>
  layers
    .reduce(overrideTransparentPixelsInImage, TRANSPARENT_IMG)
    .map(numbersToOutputChars)
    .reduce(imgToMultiLineString);
