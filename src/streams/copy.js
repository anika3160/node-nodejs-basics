import fs from 'node:fs';
import { stat } from 'node:fs/promises';

export const copyFileByStreamAPI = async (pathToReadFile, pathToNewFile) => {
        await stat(pathToReadFile);
        try {
            await stat(pathToNewFile);
            throw new Error('Path already exists')
        } catch(err) {
            if (err.message === 'Path already exists') {
                throw err;
            } else {
                const readStream = fs.createReadStream(pathToReadFile);
                const writeStream = fs.createWriteStream(pathToNewFile);

                readStream.on('end', () => {
                    process.stdout.write('Copy completed.\n');
                });

                readStream.pipe(writeStream);

            }
        }
};
