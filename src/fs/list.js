import fs from 'node:fs';
import { promisify } from 'node:util';

const prReaddir = promisify(fs.readdir);

export const getList = async (pathToDir) => {
    try {
        const files = await prReaddir(pathToDir, {encoding: 'utf-8'});
        return files;
    }
    catch(err) {
        throw new Error('FS operation failed');
    }
};
