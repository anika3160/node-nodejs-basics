import { stdin, stdout } from 'node:process';
import path from 'node:path';
import os from 'node:os';

import { getValueByCLIArgs } from "./cli/args.js";
import {
    FILE_OPERATIONS_CONSTANTS,
    FLAG_CONSTANTS,
    NAVIGATION_CONSTANTS,
    OPERATION_FAILED_ERROR_TEXT_MESSAGE,
} from "./constants.js";
import { printTable } from "./fs/list.js";
import { getNewPathFromInput } from './navigation/index.js';
import { readFileByStreamAPI } from './streams/read.js';
import { writeToFileUsingStreamAPI } from './streams/write.js';
import rename from './fs/rename.js';

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
                    pathToCurrentDir = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir);
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
                    await readFileByStreamAPI(pathToFile);
                } catch(err) {
                    await emitError();
                }
                break;
            }
            case FILE_OPERATIONS_CONSTANTS.add: {
                try {
                    const pathToFile = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir, true);
                    await writeToFileUsingStreamAPI(pathToFile, '');
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
