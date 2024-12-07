import { readFileSync } from 'fs';

export default () =>
  readFileSync(
    process.argv[2].replace('day', 'input').replace('.ts', '.txt'),
    'utf8',
  );
