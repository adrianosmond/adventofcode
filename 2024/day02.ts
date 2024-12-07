import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';

const input = readInput();
const lines = input.split('\n');
const reports = lines.map((l) => strToIntArray(l, ' '));

const checkReport = (report: number[]) => {
  const increasing = report[1] > report[0];

  for (let j = 1; j < report.length; j++) {
    const diff = report[j] - report[j - 1];
    if (
      (increasing && (diff < 1 || diff > 3)) ||
      (!increasing && (diff > -1 || diff < -3))
    ) {
      return false;
    }
  }

  return true;
};

export const part1 = () => reports.map(checkReport).filter(Boolean).length;

export const part2 = () =>
  reports
    .map((r) => {
      for (let i = 0; i < r.length; i++) {
        const report = [...r];
        report.splice(i, 1);
        if (checkReport(report)) return true;
      }
      return false;
    })
    .filter(Boolean).length;
