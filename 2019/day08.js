const input = require('./input08');

const IMG_WIDTH = 25;
const IMG_HEIGHT = 6;
const pixels = input.split('').map(p => parseInt(p, 10));
const numPixels = pixels.length;
const pxPerLayer = IMG_WIDTH * IMG_HEIGHT;
const numLayers = numPixels / pxPerLayer;

const layers = new Array(numLayers)
  .fill()
  .map((_, i) => pixels.slice(i * pxPerLayer, i * pxPerLayer + pxPerLayer));

const day8part1 = () =>
  layers
    .map(l => ({
      zeros: l.filter(x => x === 0).length,
      score: l.filter(x => x === 1).length * l.filter(x => x === 2).length,
    }))
    .reduce((best, current) => (current.zeros >= best.zeros ? best : current), {
      zeros: pxPerLayer,
      score: -1,
    }).score;

const day8part2 = () =>
  layers
    .reduce(
      (img, layer) => img.map((px, i) => (px < 2 ? px : layer[i])),
      new Array(pxPerLayer).fill(2),
    )
    .map(px => [' ', '#'][px])
    .reduce(
      (img, px, idx) => img + px + ((idx + 1) % IMG_WIDTH === 0 ? '\n' : ''),
    );

console.log('part1:', day8part1());
console.log('part2:');
console.log(day8part2());
