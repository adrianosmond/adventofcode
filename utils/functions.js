module.exports = {
  manhattan: ([x1, y1], [x2, y2] = [0, 0]) =>
    Math.abs(x1 - x2) + Math.abs(y1 - y2),
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
};
