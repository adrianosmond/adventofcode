export const highestByKey =
  <K extends object>(key: keyof K & string) =>
  (best: K, current: K) =>
    current[key] > best[key] ? current : best;

export const highestWithIndex = <T>(
  best: { best: T; index: number },
  curr: T,
  index: number,
) =>
  curr > best.best
    ? {
        best: curr,
        index,
      }
    : best;

export const lowestByKey =
  <K extends object>(key: keyof K & string) =>
  (best: K, current: K) =>
    current[key] < best[key] ? current : best;

export const lowestWithIndex = <T>(
  best: { best: T; index: number },
  curr: T,
  index: number,
) =>
  best.best > curr
    ? {
        best: curr,
        index,
      }
    : best;

export const mergeObjects = <T>(all: T, curr: T) => ({
  ...all,
  ...curr,
});

export const sum = (tot: number, curr: number) => tot + curr;

export const sumByKey =
  <K extends string>(key: K) =>
  <T extends Record<K, number>>(tot: number, curr: T) =>
    tot + curr[key];

export const product = (tot: number, curr: number) => tot * curr;

export const countOccurrences = (
  acc: Record<string | number, number>,
  v: string | number,
) => ({
  ...acc,
  [v]: (acc[v] ?? 0) + 1,
});
