import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const create = async (pathToFile) => {
    try {
        await fs.access(pathToFile, fs.constants.F_OK);
    }
    catch (err) {
        await fs.writeFile(pathToFile, '');
        return; 
    }
    throw new Error('FS operation failed'); 
};

export default create;
