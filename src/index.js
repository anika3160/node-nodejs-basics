import { stdin, stdout } from 'node:process';
// import path from 'node:path';
// import { fileURLToPath } from 'node:url';
import os from 'node:os';

import { getValueByCLIArgs } from "./cli/args.js";
import { FLAG_CONSTANTS} from "./constants.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


const username = getValueByCLIArgs(FLAG_CONSTANTS.USERNAME_FLAG);

const printGoodbyeMsg = async () => {
    stdout.write (`\nThank you for using File Manager, ${username}, goodbye!`);
    process.exit();
} 

const printCurrentDir = async (curDirname = os.homedir()) => {
    stdout.write(`You are currently in ${curDirname}\n`);
}

const fileManager = async () => {
    stdout.write(`Welcome to the File Manager, ${username}!\n`);
    process.on('SIGINT', printGoodbyeMsg);

    stdin.on('data', async (data) => {
        if (data.toString() === FLAG_CONSTANTS.EXIT_FLAG) {
           await printGoodbyeMsg();
        }

        await printCurrentDir();
    })
};

await fileManager();
