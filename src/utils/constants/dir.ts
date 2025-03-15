import path from 'path';

const DIST_DIR = path.dirname(import.meta.url);
export const CLI_DIR = path.join(DIST_DIR, '../');
