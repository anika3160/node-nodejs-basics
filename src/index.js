import { stdin, stdout } from 'node:process'; 

import { getValueByCLIArgs } from "./cli/args.js";
import { FLAG_CONSTANTS} from "./constants.js";

const username = getValueByCLIArgs(FLAG_CONSTANTS.USERNAME_FLAG);

const printGoodbyeMsg = async () => {
    stdout.write (`\nThank you for using File Manager, ${username}, goodbye!`);
    process.exit();
} 

const fileManager = async () => {
    stdout.write(`Welcome to the File Manager, ${username}!\n`);
    stdin.on('data', async (data) => {
        if (data.toString() === FLAG_CONSTANTS.EXIT_FLAG) {
           await printGoodbyeMsg();
        }
    })
    process.on('SIGINT', async () => {
        await printGoodbyeMsg();
    })
};

await fileManager();
