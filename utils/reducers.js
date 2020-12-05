module.exports = {
  highestByKey: (key) => (best, current) =>
    current[key] > best[key] ? current : best,
  highestWithIndex: (best, curr, index) =>
    curr > best.best
      ? {
          best: curr,
          index,
        }
      : best,
  lowestByKey: (key) => (best, current) =>
    current[key] < best[key] ? current : best,
  lowestWithIndex: (best, curr, index) =>
    best.best > curr
      ? {
          best: curr,
          index,
        }
      : best,
  mergeObjects: (all, curr) => ({
    ...all,
    ...curr,
  }),
  sum: (tot, curr) => tot + curr,
  sumByKey: (key) => (tot, curr) => tot + curr[key],
};
