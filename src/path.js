import fs from 'node:fs/promises';
import path from 'node:path';

export const isPathExist = async (pathForCheck) => {
    try {
        await fs.stat(pathForCheck);
    } catch(err) {
        return false;
    }
    return true;
}

export const getLastNameFromPath = (inputPath) => {
    const arrOfArgs = inputPath.split(path.sep);
    return arrOfArgs[arrOfArgs.length-1];
}

export const getNewPathFromInput = async (inputPath, pathToCurrentDir, isNewPath) => {
    let newPath;

    if (path.isAbsolute(inputPath)) {
        newPath = path.resolve(inputPath);
    } else {
        newPath = path.resolve(pathToCurrentDir, inputPath);
    }
   
    if (isNewPath) {
        const isExist = await isPathExist(newPath);
        if (isExist) throw new Error(`${newPath} is exist.`)
    } else {
        await fs.stat(newPath);
    }

    return newPath;
}
