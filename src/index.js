import { stdin, stdout } from 'node:process';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';

import { getValueByCLIArgs } from "./cli/args.js";
import {
    FILE_OPERATIONS_CONSTANTS,
    FLAG_CONSTANTS,
    NAVIGATION_CONSTANTS,
    OPERATION_FAILED_ERROR_TEXT_MESSAGE,
    OPERATING_SYSTEM_CONSTANTS,
} from "./constants.js";
import { printTable } from "./fs/list.js";
import { getNewPathFromInput, isPathExist, getLastNameFromPath } from './path.js';
import { readFileByStreamAPI } from './streams/read.js';
import { writeToFileUsingStreamAPI } from './streams/write.js';
import { copyFileByStreamAPI } from './streams/copy.js';
import rename from './fs/rename.js';
import deleteFile from './fs/delete.js';
import createFile from './fs/create.js';
import { getOSInfo } from './os.js';

const username = getValueByCLIArgs(FLAG_CONSTANTS.USERNAME_FLAG);

const printGoodbyeMsg = async () => {
    stdout.write (`\nThank you for using File Manager, ${username}, goodbye!`);
    process.exit();
} 

const printCurrentDir = async (pathToCurrentDir = os.homedir()) => {
    stdout.write(`You are currently in ${pathToCurrentDir}\n`);
}

const emitError = async () => {
    stdin.emit('error', new Error(OPERATION_FAILED_ERROR_TEXT_MESSAGE + '\n'));
}

const fileManager = async () => {
    let pathToCurrentDir = os.homedir();
    stdout.write(`Welcome to the File Manager, ${username}!\n`);
    process.on('SIGINT', printGoodbyeMsg);

    stdin.on('data', async (data) => {
        const dataString = data.toString().trim();
        const dataStringArgs = dataString.split(' ');
        const command = dataStringArgs[0];

        switch (command) {
            case NAVIGATION_CONSTANTS.exit: {
                await printGoodbyeMsg();
            }
            case NAVIGATION_CONSTANTS.up: {
                if (pathToCurrentDir === os.homedir()) {
                    await emitError();
                    break;
                }
                const arrOfDirNames = pathToCurrentDir.split(path.sep);
                pathToCurrentDir = arrOfDirNames.slice(0, -1).join(path.sep);
                break;
            }
            case NAVIGATION_CONSTANTS.cd: {
                try {
                    const pathFromInput = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir);
                    const stat = await fs.lstat(pathFromInput);

                    if (stat.isDirectory()) {
                        pathToCurrentDir = pathFromInput;
                    } else {
                        throw new Error (`${pathFromInput} is not a directory.`);
                    }
                }
                catch(err) {
                    await emitError();
                }
                break;
            }
            case NAVIGATION_CONSTANTS.ls: {
                await printTable(pathToCurrentDir);
                break;
            }
            case FILE_OPERATIONS_CONSTANTS.cat: {
                try {
                    const pathToFile = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir);
                    const stat = await fs.lstat(pathToFile);
                    if (stat.isFile()) {
                        await readFileByStreamAPI(pathToFile);
                    } else {
                        throw new Error (`${pathFromInput} is not a file.`);
                    }
                } catch(err) {
                    await emitError();
                }
                break;
            }
            case FILE_OPERATIONS_CONSTANTS.add: {
                try {
                    const pathToFile = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir, true);
                    await createFile(pathToFile);
                } catch(err) {
                    await emitError();
                }
                break;
            }
            case FILE_OPERATIONS_CONSTANTS.rn: {
                try {
                    const pathToFileForRename = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir);
                    const pathToNewFile = await getNewPathFromInput(dataStringArgs[2], pathToCurrentDir, true);
                    await rename(pathToFileForRename, pathToNewFile);
                } catch(err) {
                    await emitError();
                }
                break;
            }
            case FILE_OPERATIONS_CONSTANTS.cp: {
                try {
                    const pathToReadFile = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir);
                    const pathToNewDir = await getNewPathFromInput(dataStringArgs[2], pathToCurrentDir, true);
                    const fileName = getLastNameFromPath(pathToReadFile);

                    await copyFileByStreamAPI(pathToReadFile, pathToNewDir, fileName);
                } catch(err) {
                    await emitError();
                }
                break;
            }
            case FILE_OPERATIONS_CONSTANTS.mv: {
                try {
                    const pathToFileForMove = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir);
                    const pathToNewFile = await getNewPathFromInput(dataStringArgs[2], pathToCurrentDir, true);
                    await copyFileByStreamAPI(pathToFileForMove, pathToNewFile);
                    await deleteFile(pathToFileForMove);
                } catch(err) {
                    await emitError();
                }
                break;
            }
            case FILE_OPERATIONS_CONSTANTS.rm: {
                try {
                    const pathToFile = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir);
                    await deleteFile(pathToFile);
                } catch(err) {
                    await emitError();
                }
                break;
            }
            case OPERATING_SYSTEM_CONSTANTS.os: {
                getOSInfo(dataStringArgs[1]);
                break;
            }
            default: {
                stdout.write('Invalid input\n');
            }
        }

        await printCurrentDir(pathToCurrentDir);
    })

    stdin.on('error', async (err = new Error(OPERATION_FAILED_ERROR_TEXT_MESSAGE + '\n')) => {
        stdout.write(err.message);
    })
};

await fileManager();
