import { createHash } from 'crypto';

const hash = createHash('md5');

export function shortId(id: string): string {
  hash.update(id);
  return hash.digest('hex');
}
