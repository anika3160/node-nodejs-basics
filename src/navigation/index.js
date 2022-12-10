import fs from 'node:fs/promises';
import path from 'node:path';

export const getNewPathFromCdNavigation = async (inputPath, pathToCurrentDir) => {
    let newPathToCurrentDir;

    if (path.isAbsolute(inputPath)) {
        newPathToCurrentDir = inputPath;
    } else {
        newPathToCurrentDir = path.normalize(pathToCurrentDir + path.sep + inputPath);
    }
   
   try {
        await fs.stat(newPathToCurrentDir);
    } catch(err) {
        throw err;
    }

    return newPathToCurrentDir;
}
