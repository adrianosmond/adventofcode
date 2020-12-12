module.exports = {
  manhattan: ([x1, y1], [x2, y2] = [0, 0]) =>
    Math.abs(x1 - x2) + Math.abs(y1 - y2),
  strToIntArray: (str) => str.split('\n').map((number) => parseInt(number, 10)),
};
