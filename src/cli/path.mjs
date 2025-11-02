import fs from 'node:fs/promises'
import path from 'node:path'

import { DATA_TYPES } from '../constants/index.mjs'

const normalizeSeparators = (inputPath = '') => {
  if (!inputPath) return inputPath;

  if (process.platform === 'win32') {
    return inputPath.replace(/\//g, path.win32.sep);
  }

  return inputPath.replace(/\\/g, path.posix.sep);
};


export const isPathExist = async (pathForCheck) => {
  try {
    const normalized = normalizeSeparators(pathForCheck);
    await fs.stat(normalized);
  } catch(err) {
    return false;
  }
  return true;
}

export const getLastNameFromPath = (inputPath) => {
  const normalized = normalizeSeparators(inputPath);
  const arrOfArgs = normalized.split(path.sep);
  return arrOfArgs[arrOfArgs.length - 1];
};


export const getNewPathFromInput = async (inputPath, pathToCurrentDir, isNewPath) => {
  if (!inputPath) throw new Error('Path is required');

  const normalizedTarget = normalizeSeparators(inputPath);
  const normalizedBase = normalizeSeparators(pathToCurrentDir);

  const newPath = path.isAbsolute(normalizedTarget)
    ? path.resolve(normalizedTarget)
    : path.resolve(normalizedBase, normalizedTarget);

  if (isNewPath) {
    if (await isPathExist(newPath)) throw new Error(`${newPath} already exists.`);
  } else {
    await fs.stat(newPath);
  }

  return newPath;
};


export const getUpPath = (currentPath) => {
  const normalized = normalizeSeparators(currentPath);
  const { root } = path.parse(normalized);
  if (normalized === root) return root;
  return path.dirname(normalized);
};

export const getElTypeFromPath = async (pathToEl) => {
  const normalized = normalizeSeparators(pathToEl);
  const stat = await fs.lstat(normalized);
  const isDir = stat.isDirectory();
  if (isDir) return DATA_TYPES.directory;
  const isFile = stat.isFile();
  if (isFile) return DATA_TYPES.file;
  return undefined;
};
