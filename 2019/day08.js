const input = require('./input08'); // String

const OUTPUT_CHARS = [' ', '#']; // Black and white pixels
const IMG_WIDTH = 25;
const IMG_HEIGHT = 6;
const PX_PER_LAYER = IMG_WIDTH * IMG_HEIGHT;
const pixels = input.split('').map(p => parseInt(p, 10));
const numLayers = pixels.length / PX_PER_LAYER;

const layers = new Array(numLayers)
  .fill()
  .map((_, i) =>
    pixels.slice(i * PX_PER_LAYER, i * PX_PER_LAYER + PX_PER_LAYER),
  );

const day8part1 = () =>
  layers
    .map(l => ({
      zeros: l.filter(x => x === 0).length,
      score: l.filter(x => x === 1).length * l.filter(x => x === 2).length,
    }))
    .reduce((best, current) => (current.zeros >= best.zeros ? best : current), {
      zeros: PX_PER_LAYER,
      score: -1,
    }).score;

const day8part2 = () =>
  layers
    .reduce(
      (img, layer) => img.map((px, i) => (px < 2 ? px : layer[i])),
      new Array(PX_PER_LAYER).fill(2),
    )
    .map(px => OUTPUT_CHARS[px])
    .reduce(
      (img, px, idx) => img + px + ((idx + 1) % IMG_WIDTH === 0 ? '\n' : ''),
    );

console.log('part1:', day8part1());
console.log('part2:');
console.log(day8part2());
