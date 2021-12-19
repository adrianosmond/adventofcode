const hexMap = {
  0: '0000',
  1: '0001',
  2: '0010',
  3: '0011',
  4: '0100',
  5: '0101',
  6: '0110',
  7: '0111',
  8: '1000',
  9: '1001',
  A: '1010',
  B: '1011',
  C: '1100',
  D: '1101',
  E: '1110',
  F: '1111',
};

module.exports = {
  manhattan: ([x1, y1], [x2, y2] = [0, 0]) =>
    Math.abs(x1 - x2) + Math.abs(y1 - y2),
  manhattan3d: ([x1, y1, z1], [x2, y2, z2] = [0, 0, 0]) =>
    Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2),
  strToIntArray: (str, sep = '\n') =>
    str.split(sep).map((number) => parseInt(number, 10)),
  permutator: (inputArr) => {
    const results = [];

    function permute(arr, memo = []) {
      let cur;

      for (let i = 0; i < arr.length; i++) {
        cur = arr.splice(i, 1);
        if (arr.length === 0) {
          results.push(memo.concat(cur));
        }
        permute(arr.slice(), memo.concat(cur));
        arr.splice(i, 0, cur[0]);
      }

      return results;
    }

    return permute(inputArr);
  },
  getNeighbours: (grid, rowIdx, colIdx) => {
    const neighbours = [];
    if (rowIdx < grid.length - 1)
      neighbours.push([rowIdx + 1, colIdx, grid[rowIdx + 1][colIdx]]);
    if (rowIdx > 0)
      neighbours.push([rowIdx - 1, colIdx, grid[rowIdx - 1][colIdx]]);
    if (colIdx < grid[0].length - 1)
      neighbours.push([rowIdx, colIdx + 1, grid[rowIdx][colIdx + 1]]);
    if (colIdx > 0)
      neighbours.push([rowIdx, colIdx - 1, grid[rowIdx][colIdx - 1]]);
    return neighbours;
  },
  hexToBinaryStr: (bin) =>
    bin
      .split('')
      .map((c) => hexMap[c])
      .join(''),
};
