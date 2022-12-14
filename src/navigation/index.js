import fs from 'node:fs/promises';
import path from 'node:path';

export const getNewPathFromInput = async (inputPath, pathToCurrentDir, isNewPath) => {
    let newPath;

    if (path.isAbsolute(inputPath)) {
        newPath = inputPath;
    } else {
        newPath = path.normalize(pathToCurrentDir + path.sep + inputPath);
    }
   
    if (!isNewPath) await fs.stat(newPath);

    return newPath;
}
