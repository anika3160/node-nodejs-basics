import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const create = async () => {
    const pathToFile = `${__dirname}/files/fresh.txt`;

    try {
        await fs.access(pathToFile, fs.constants.F_OK);
    }
    catch (err) {
        await fs.writeFile(path.join(__dirname, 'files', 'fresh.txt'), 'I am fresh and young');
        return; 
    }
    throw new Error('FS operation failed'); 
};

await create();
