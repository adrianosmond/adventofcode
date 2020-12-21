const fs = require('fs');
const path = require('path');

// const input = fs.readFileSync(path.resolve(__dirname, 'input20.txt'), 'utf8');

const input = `Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`;

const tiles = {};

input.split('\n\n').forEach((tile) => {
  const [title, ...rows] = tile.split('\n');
  const index = title.match(/Tile (\d+):/)[1];
  tiles[index] = [
    rows[0],
    rows[rows.length - 1],
    rows
      .map((r) => r[0])
      .flat()
      .join(''),
    rows
      .map((r) => r[r.length - 1])
      .flat()
      .join(''),
  ];
});

const part1 = () =>
  Object.entries(tiles).reduce((total, [tile, edges]) => {
    const tilesFromOtherEdges = Object.values(tiles)
      .filter((e) => e !== edges)
      .flat();

    const numMatches = edges
      .map(
        (edge) =>
          tilesFromOtherEdges.includes(edge) ||
          tilesFromOtherEdges.includes(edge.split('').reverse().join('')),
      )
      .reduce((tot, curr) => tot + (curr ? 1 : 0), 0);

    if (numMatches === 2) return total * parseInt(tile, 10);
    return total;
  }, 1);

const part2 = () => {};

console.log('part1', part1());
console.log('part2', part2());
