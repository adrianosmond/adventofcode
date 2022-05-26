export const highestByKey = (key) => (best, current) =>
  current[key] > best[key] ? current : best;
export const highestWithIndex = (best, curr, index) =>
  curr > best.best
    ? {
        best: curr,
        index,
      }
    : best;
export const lowestByKey = (key) => (best, current) =>
  current[key] < best[key] ? current : best;
export const lowestWithIndex = (best, curr, index) =>
  best.best > curr
    ? {
        best: curr,
        index,
      }
    : best;
export const mergeObjects = (all, curr) => ({
  ...all,
  ...curr,
});
export const sum = (tot, curr) => tot + curr;
export const sumByKey = (key) => (tot, curr) => tot + curr[key];
export const product = (tot, curr) => tot * curr;
