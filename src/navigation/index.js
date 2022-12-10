import fs from 'node:fs/promises';
import path from 'node:path';

export const getNewPathFromInput = async (inputPath, pathToCurrentDir) => {
    let newPath;

    if (path.isAbsolute(inputPath)) {
        newPath = inputPath;
    } else {
        newPath = path.normalize(pathToCurrentDir + path.sep + inputPath);
    }
   
   try {
        await fs.stat(newPath);
    } catch(err) {
        throw err;
    }

    return newPath;
}
