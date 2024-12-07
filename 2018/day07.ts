import readInput from '../utils/readInput.ts';

const input = readInput().split('\n');

type Worker = { freeAt: number; workingOn: string | undefined };
type StepDep = {
  waitingFor: string[];
  requiredFor: string[];
  assigned: boolean;
};
type Deps = Record<string, StepDep>;
type FreeWorkers = { freeAt: number; workers: Worker[] };

const FREE_WORKER: Worker = {
  freeAt: 0,
  workingOn: undefined,
};

const connections = input.map((str) => [str.substr(5, 1), str.substr(36, 1)]);

const getStepTime = (step: string) => step.charCodeAt(0) - 4;

const isWorkerFree = (worker: Worker, time: number) => worker.freeAt <= time;

const workersFree = (workers: Worker[], time: number) =>
  workers.some((w) => isWorkerFree(w, time));

const isAvailable = (s: StepDep) => s.waitingFor.length === 0;

const isAssigned = (s: StepDep) => s.assigned;

const setupDependencies = (): Deps => {
  const dependencies: Deps = {};
  connections.forEach(([before, after]) => {
    if (!dependencies[before]) {
      dependencies[before] = {
        waitingFor: [],
        requiredFor: [],
        assigned: false,
      };
    }
    if (!dependencies[after]) {
      dependencies[after] = {
        waitingFor: [],
        requiredFor: [],
        assigned: false,
      };
    }
    dependencies[before].requiredFor.push(after);
    dependencies[after].waitingFor.push(before);
  });
  return dependencies;
};

const setupWorkers = (numWorkers = 5): Worker[] =>
  Array(numWorkers)
    .fill(null)
    .map(() => ({ ...FREE_WORKER }));

const getNextFreeWorkers = (
  workers: Worker[],
  completing = false,
): FreeWorkers =>
  workers
    .filter((w) => !completing || (completing && w.workingOn))
    .reduce<FreeWorkers>(
      (nextWorkers, currentWorker) => {
        if (currentWorker.freeAt > nextWorkers.freeAt) {
          return nextWorkers;
        }
        return {
          freeAt: currentWorker.freeAt,
          workers: [
            currentWorker,
            ...(currentWorker.freeAt === nextWorkers.freeAt
              ? nextWorkers.workers
              : []),
          ],
        };
      },
      {
        freeAt: Number.MAX_VALUE,
        workers: [],
      },
    );

const getAvailableSteps = (dependencies: Deps) =>
  Object.keys(dependencies)
    .filter((s) => isAvailable(dependencies[s]) && !isAssigned(dependencies[s]))
    .sort();

const updateDependencies = (dependencies: Deps, completed: string[]): Deps => {
  const depsToUpdate = completed.map((s) => dependencies[s].requiredFor).flat();
  return Object.keys(dependencies).reduce<Deps>(
    (prev, curr) =>
      completed.includes(curr)
        ? prev
        : {
            ...prev,
            [curr]: {
              ...dependencies[curr],
              ...(depsToUpdate.includes(curr) && {
                waitingFor: dependencies[curr].waitingFor.filter(
                  (x) => !completed.includes(x),
                ),
              }),
            },
          },
    {},
  );
};

const freeUpWorkers = (allWorkers: Worker[], { workers }: FreeWorkers) =>
  allWorkers.map((worker) =>
    workers.includes(worker) ? { ...FREE_WORKER } : worker,
  );

const freeUpDependencies = ({ workers }: FreeWorkers, dependencies: Deps) => {
  const workingOn = workers
    .map((w) => w.workingOn)
    .filter((w) => w !== undefined);

  return updateDependencies(dependencies, workingOn);
};

const jumpToFreeTime = (
  dependencies: Deps,
  workers: Worker[],
  freeWorkers: FreeWorkers,
): [Deps, Worker[], number] => [
  freeUpDependencies(freeWorkers, dependencies),
  freeUpWorkers(workers, freeWorkers),
  freeWorkers.freeAt,
];

export const part1 = () => {
  let dependencies = setupDependencies();
  let steps = Object.keys(dependencies);
  let order = '';
  while (steps.length > 0) {
    const nextStep = getAvailableSteps(dependencies)[0];
    order += nextStep;
    dependencies = updateDependencies(dependencies, [nextStep]);
    steps = Object.keys(dependencies);
  }
  return order;
};

export const part2 = () => {
  let deps = setupDependencies();
  let workers = setupWorkers();
  let time = 0;
  let steps = Object.keys(deps);

  while (steps.length > 0) {
    if (!workersFree(workers, time)) {
      const nextWorkers = getNextFreeWorkers(workers);
      [deps, workers, time] = jumpToFreeTime(deps, workers, nextWorkers);
    }

    let available = getAvailableSteps(deps);
    if (available.length === 0) {
      const nextWorkers = getNextFreeWorkers(workers, true);
      [deps, workers, time] = jumpToFreeTime(deps, workers, nextWorkers);
      available = getAvailableSteps(deps);
    }

    let assigned = 0;
    for (let w = 0; w < workers.length && assigned < available.length; w++) {
      const worker = workers[w];
      if (isWorkerFree(worker, time)) {
        const step = available[assigned];
        deps[step].assigned = true;
        worker.freeAt = time + getStepTime(step);
        worker.workingOn = step;
        assigned++;
      }
    }

    steps = Object.keys(deps);
  }
  return time;
};
