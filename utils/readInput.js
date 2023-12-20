import { readFileSync } from 'fs';

export default () =>
  readFileSync(
    process.argv[2].replace('day', 'input').replace('.js', '.txt'),
    'utf8',
  );
