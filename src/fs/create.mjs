import fs from 'node:fs/promises';

import { FS_OPERATION_FAILED_ERROR_TEXT_MESSAGE } from '../constants/index.mjs';
const createFile = async (pathToFile) => {
    try {
        await fs.access(pathToFile, fs.constants.F_OK);
    }
    catch (err) {
        await fs.writeFile(pathToFile, '');
        process.stdout.write('File created.\n');
        return; 
    }
    throw new Error(FS_OPERATION_FAILED_ERROR_TEXT_MESSAGE); 
};

const createDirectory = async (pathToDirectory) => {
    try {
        await fs.access(pathToDirectory, fs.constants.F_OK);
    }
    catch (err) {
        await fs.mkdir(pathToDirectory, { recursive: true });
        process.stdout.write('Directory created.\n');
        return; 
    }
    throw new Error(FS_OPERATION_FAILED_ERROR_TEXT_MESSAGE); 
}

export {
    createFile,
    createDirectory
}
