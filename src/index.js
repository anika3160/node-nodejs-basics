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
        let isValidInput = false;

        if (dataString.length >= 3 && dataString.slice(0, 2) === NAVIGATION_CONSTANTS.cd) {
            isValidInput = true;
            try {
                pathToCurrentDir = await getNewPathFromInput(dataString.slice(3), pathToCurrentDir);
            }
            catch(err) {
                await emitError();
            }
        }

        if (dataString.length >= 4 && dataString.slice(0,3) === FILE_OPERATIONS_CONSTANTS.cat) {
            isValidInput = true;
            try {
                const pathToFile = await getNewPathFromInput(dataString.slice(4), pathToCurrentDir);
                await readFileByStreamAPI(pathToFile);
            } catch(err) {
                await emitError();
            }
        }

        if (dataString.length >= 4 && dataString.slice(0,3) === FILE_OPERATIONS_CONSTANTS.add) {
            isValidInput = true;
            try {
                const pathToFile = await getNewPathFromInput(dataString.slice(4), pathToCurrentDir, true);
                await writeToFileUsingStreamAPI(pathToFile, '');
            } catch(err) {
                await emitError();
            }
        }

        switch (dataString) {
            case NAVIGATION_CONSTANTS.exit: {
                await printGoodbyeMsg();
            }
            case 'error': {
                isValidInput = true;
                await emitError();
                break;
            }
            case NAVIGATION_CONSTANTS.up: {
                isValidInput = true;
                if (pathToCurrentDir === os.homedir()) {
                    await emitError();
                    break;
                }
                const arrOfDirNames = pathToCurrentDir.split(path.sep);
                pathToCurrentDir = arrOfDirNames.slice(0, -1).join(path.sep);
                break;
            }
            case NAVIGATION_CONSTANTS.ls: {
                isValidInput = true;
                await printTable(pathToCurrentDir);
            }
            default: {
               if (!isValidInput) stdout.write('Invalid input\n');
            }
        }

        await printCurrentDir(pathToCurrentDir);
    })

    stdin.on('error', async (err = new Error(OPERATION_FAILED_ERROR_TEXT_MESSAGE + '\n')) => {
        stdout.write(err.message);
    })
};

await fileManager();
