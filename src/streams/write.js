import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { stdin } from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const writeToFileUsingStreamAPI = async (pathToFileForWrite, dataForAdd) => {
    const writeStream = fs.createWriteStream(pathToFileForWrite);

    if (dataForAdd) {
        writeStream.write(dataForAdd.toString());
    } else {
        console.log(`Write something, and I print it into the file(${pathToFileForWrite}): (If you are tired, press Ctrl+C)`)

        stdin.on('data', (data) => {
            writeStream.write(data.toString());
        })
    }
};
