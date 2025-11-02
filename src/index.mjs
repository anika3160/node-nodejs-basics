import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { stdin, stdout } from 'node:process'

import { getValueByCLIArgs } from "./cli/args.mjs"
import { getLastNameFromPath, getNewPathFromInput, getUpPath } from './cli/path.mjs'
import {
    COMMAND_CONSTANTS,
    FLAG_CONSTANTS,
    OPERATION_FAILED_ERROR_TEXT_MESSAGE,
} from "./constants/index.mjs"
import { createDirectory, createFile } from './fs/create.mjs'
import deleteFile from './fs/delete.mjs'
import { printTable } from "./fs/list.mjs"
import rename from './fs/rename.mjs'
import calculateHash from './hash/calcHash.mjs'
import { getOSInfo } from './os/os.mjs'
import { copyFileByStreamAPI } from './streams/copy.mjs'
import { readFileByStreamAPI } from './streams/read.mjs'
import compress from './zip/compress.mjs'
import decompress from './zip/decompress.mjs'

const username = getValueByCLIArgs(FLAG_CONSTANTS.USERNAME_FLAG);

const printGoodbyeMsg = async () => {
    console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
    process.exit();
} 

const printCurrentDir = async (pathToCurrentDir = os.homedir()) => {
    stdout.write(`You are currently in ${pathToCurrentDir}\n`);
}

const emitError = (msg = OPERATION_FAILED_ERROR_TEXT_MESSAGE) =>
    process.stderr.write(msg + '\n');

const fileManager = async () => {
    let pathToCurrentDir = os.homedir();
    stdout.write(`Welcome to the File Manager, ${username}!\n`);
    printCurrentDir(pathToCurrentDir);
    process.on('SIGINT', printGoodbyeMsg);

    stdin.on('data', async (data) => {
        const dataString = data.toString().trim();
        const dataStringArgs = dataString
        .match(/(?:[^\s"]+|"[^"]*")+/g)
        ?.map((arg) =>
            arg.startsWith('"') && arg.endsWith('"') ? arg.slice(1, -1) : arg
        ) ?? [];

        const command = dataStringArgs[0];

        switch (command) {
            case COMMAND_CONSTANTS.exit: {
                await printGoodbyeMsg();
                return;
            }
            case COMMAND_CONSTANTS.up: {
                if (pathToCurrentDir === path.parse(pathToCurrentDir).root) {
                    emitError();
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
                    emitError();
                }
                break;
            }
            case COMMAND_CONSTANTS.ls: {
                try {
                    await printTable(pathToCurrentDir);
                } catch(err) {
                    emitError();
                }
                break;
            }
            case COMMAND_CONSTANTS.cat: {
                try {
                    const pathToFile = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir);
                    const stat = await fs.lstat(pathToFile);
                    if (stat.isFile()) {
                        await readFileByStreamAPI(pathToFile);
                    } else {
                        throw new Error (`${pathToFile} is not a file.`);
                    }
                } catch(err) {
                    emitError();
                }
                break;
            }
            case COMMAND_CONSTANTS.add: {
                try {
                    const pathToFile = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir, true);
                    await createFile(pathToFile);
                } catch(err) {
                    emitError();
                }
                break;
            }
            case COMMAND_CONSTANTS.mkdir: {
                try {
                    const pathToDir = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir, true);
                    await createDirectory(pathToDir);
                } catch(err) {
                    emitError();
                }
                break;
            }
            case COMMAND_CONSTANTS.rn: {
                try {
                    //rn path_to_file new_filename
                    const pathToFileForRename = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir);
                    const newFileName = dataStringArgs[2];
                    if (path.isAbsolute(newFileName)) {
                        emitError();
                        break;
                    }
                    const pathToNewFile = path.resolve(getUpPath(pathToFileForRename), newFileName);
                    await rename(pathToFileForRename, pathToNewFile);
                } catch(err) {
                    emitError
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
                    emitError
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
                    emitError
                }
                break;
            }
            case COMMAND_CONSTANTS.rm: {
                try {
                    const pathToFile = await getNewPathFromInput(dataStringArgs[1], pathToCurrentDir);
                    await deleteFile(pathToFile);
                } catch(err) {
                    emitError
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
                    emitError();
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
                    emitError
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
                    emitError
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
