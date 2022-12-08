import { stdin, stdout } from 'node:process';
import path from 'node:path';
import os from 'node:os';
import { getValueByCLIArgs } from "./cli/args.js";
import {
    FLAG_CONSTANTS,
    NAVIGATION_CONSTANTS,
    OPERATION_FAILED_ERROR_TEXT_MESSAGE,
} from "./constants.js";
import { getList } from "./fs/list.js";
import { getNewPathFromCdNavigation } from './navigation/index.js';

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
                pathToCurrentDir = await getNewPathFromCdNavigation(dataString.slice(3), pathToCurrentDir);
            }
            catch(err) {
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
                pathToCurrentDir = arrOfDirNames.slice(0, -1).join('/');
                break;
            }
            case NAVIGATION_CONSTANTS.ls: {
                isValidInput = true;
                const list = await getList(pathToCurrentDir);
                console.log(list);
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
