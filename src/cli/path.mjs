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

export const getUpPath = (pathToUp) => {
    const arrOfDirNames = pathToUp.split(path.sep);
    return arrOfDirNames.slice(0, -1).join(path.sep);  
}
export const getElTypeFromPath = async (pathToEl) => {
    let isDir, isFile = false;
    const stat = await fs.lstat(pathToEl);
    isDir = stat.isDirectory();
    if (isDir) return 'directory';
    isFile = stat.isFile();
    if (isFile) return 'file';
    return undefined;
}