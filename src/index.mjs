import { stdin, stdout } from 'node:process';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';

import { getValueByCLIArgs } from "./cli/args.mjs";
import {
    COMMAND_CONSTANTS,
    FLAG_CONSTANTS,
    OPERATION_FAILED_ERROR_TEXT_MESSAGE,
} from "./constants/index.mjs";
import { printTable } from "./fs/list.mjs";
import { getNewPathFromInput, getLastNameFromPath, getUpPath } from './cli/path.mjs';
import { readFileByStreamAPI } from './streams/read.mjs';
import { copyFileByStreamAPI } from './streams/copy.mjs';
import rename from './fs/rename.mjs';
import deleteFile from './fs/delete.mjs';
import createFile from './fs/create.mjs';
import { getOSInfo } from './os/os.mjs';
import calculateHash from './hash/calcHash.mjs';
import compress from './zip/compress.mjs';
import decompress from './zip/decompress.mjs';

const username = getValueByCLIArgs(FLAG_CONSTANTS.USERNAME_FLAG);

const printGoodbyeMsg = async () => {
    console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
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
            case COMMAND_CONSTANTS.exit: {
                await printGoodbyeMsg();
            }
            case COMMAND_CONSTANTS.up: {
                if (pathToCurrentDir === os.homedir()) {
                    await emitError();
                    break;
                }
                pathToCurrentDir = getUpPath(pathToCurrentDir);
                break;
            }
            case COMMAND_CONSTANTS.cd: {
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
            case COMMAND_CONSTANTS.ls: {
                await printTable(pathToCurrentDir);
                break;
            }
            case COMMAND_CONSTANTS.cat: {
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
            case COMMAND_CONSTANTS.add: {
                try {
                    const pathToFile = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir, true);
                    await createFile(pathToFile);
                } catch(err) {
                    await emitError();
                }
                break;
            }
            case COMMAND_CONSTANTS.rn: {
                try {
                    //rn path_to_file new_filename
                    const pathToFileForRename = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir);
                    const newFileName = dataStringArgs[2];
                    if (path.isAbsolute(newFileName)) {
                        await emitError();
                        break;
                    }
                    const pathToNewFile = path.resolve(getUpPath(pathToFileForRename), newFileName);
                    await rename(pathToFileForRename, pathToNewFile);
                } catch(err) {
                    await emitError();
                }
                break;
            }
            case COMMAND_CONSTANTS.cp: {
                try {
                    const pathToReadFile = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir);
                    const pathToNewDir = await getNewPathFromInput(dataStringArgs[2], pathToCurrentDir);
                    const fileName = getLastNameFromPath(pathToReadFile);

                    await copyFileByStreamAPI(pathToReadFile, pathToNewDir, fileName);
                } catch(err) {
                    await emitError();
                }
                break;
            }
            case COMMAND_CONSTANTS.mv: {
                try {
                    const pathToFileForMove = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir);
                    const pathToNewDir = await getNewPathFromInput(dataStringArgs[2], pathToCurrentDir);
                    const fileName = getLastNameFromPath(pathToFileForMove);

                    await copyFileByStreamAPI(pathToFileForMove, pathToNewDir, fileName, true);
                    await deleteFile(pathToFileForMove, true);
                    process.stdout.write(`${pathToFileForMove} file moved.\n`)
                } catch(err) {
                    await emitError();
                }
                break;
            }
            case COMMAND_CONSTANTS.rm: {
                try {
                    const pathToFile = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir);
                    await deleteFile(pathToFile);
                } catch(err) {
                    await emitError();
                }
                break;
            }
            case COMMAND_CONSTANTS.os: {
                getOSInfo(dataStringArgs[1]);
                break;
            }
            case COMMAND_CONSTANTS.hash: {
                try {
                    const pathToFile = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir);
                    await calculateHash(pathToFile);
                } catch(err) {
                    await emitError();
                }
                break;
            }
            case COMMAND_CONSTANTS.compress: {
                try {
                    //compress path_to_file path_to_destination
                    //.[txt].br
                    const pathToCompressFile = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir);
                    const pathToNewFile = await getNewPathFromInput(dataStringArgs[2], pathToCurrentDir, true);
                    await compress(pathToCompressFile, pathToNewFile);
                } catch(err) {
                    await emitError();
                }
                break;
            }
            case COMMAND_CONSTANTS.decompress: {
                try {
                    //decompress path_to_file path_to_destination
                    const pathToDecompressFile = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir);
                    const pathToOriginalFile = await getNewPathFromInput(dataStringArgs[2], pathToCurrentDir, true);
                    await decompress(pathToDecompressFile, pathToOriginalFile);
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
