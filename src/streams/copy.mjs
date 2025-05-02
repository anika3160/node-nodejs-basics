import fs from 'node:fs';
import { access } from 'node:fs/promises';
import path from 'node:path';

export const copyFileByStreamAPI = async (pathToReadFile, pathToNewDir, fileName, skipMessage) => {
        const pathToNewFile = path.resolve(pathToNewDir, fileName);

        try {
            await access(pathToReadFile, fs.constants.F_OK);
            await access(pathToNewFile, fs.constants.F_OK);
            throw new Error('File already exists');
        } catch(err) {
            if (err.message === 'File already exists') {
                throw err;
            } else {
                const readStream = fs.createReadStream(pathToReadFile);
                const writeStream = fs.createWriteStream(pathToNewFile);

                return new Promise((resolve, reject) => {
                    const streams = readStream.pipe(writeStream);
                    streams.on('finish', () => {
                        if (!skipMessage) process.stdout.write('Copy completed.\n');
                        resolve();
                    });
                    streams.on('error', () => {
                        readStream.destroy();
                        reject('error');
                    });
                });
            }
        }
};
