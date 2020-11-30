const input = require('./input08'); // String

const OUTPUT_CHARS = [' ', '#']; // Representing black and white pixels
const IMG_WIDTH = 25;
const IMG_HEIGHT = 6;
const PX_PER_LAYER = IMG_WIDTH * IMG_HEIGHT;
const ALL_ZEROS = { zeros: PX_PER_LAYER, score: 0 };
const TRANSPARENT_IMG = new Array(PX_PER_LAYER).fill(2);
const pixels = input.split('').map((p) => parseInt(p, 10));
const numLayers = pixels.length / PX_PER_LAYER;

const layers = new Array(numLayers)
  .fill()
  .map((_, i) =>
    pixels.slice(i * PX_PER_LAYER, i * PX_PER_LAYER + PX_PER_LAYER),
  );

const getZerosAndScore = (layer) => ({
  zeros: layer.filter((x) => x === 0).length,
  score:
    layer.filter((x) => x === 1).length * layer.filter((x) => x === 2).length,
});

const chooseLayerWithFewestZeros = (best, layer) =>
  layer.zeros > best.zeros ? best : layer;

const overrideTransparentPixelsInImage = (img, layer) =>
  img.map((px, i) => (px < 2 ? px : layer[i]));

const numbersToOutputChars = (px) => OUTPUT_CHARS[px];

const imgToMultiLineString = (img, px, idx) =>
  img + px + ((idx + 1) % IMG_WIDTH === 0 ? '\n' : '');

const day8part1 = () =>
  layers.map(getZerosAndScore).reduce(chooseLayerWithFewestZeros, ALL_ZEROS)
    .score;

const day8part2 = () =>
  layers
    .reduce(overrideTransparentPixelsInImage, TRANSPARENT_IMG)
    .map(numbersToOutputChars)
    .reduce(imgToMultiLineString);

console.log('part1:', day8part1());
console.log(`part2:\n${day8part2()}`);
