import fs from 'node:fs';
import { stat, access} from 'node:fs/promises';
import { isPathExist } from '../path.js';

export const copyFileByStreamAPI = async (pathToReadFile, pathToNewDir, fileName) => {
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
                // проверить сущ путя если нет, то добавить его
                const writeStream = fs.createWriteStream(pathToNewFile);

                readStream.on('end', () => {
                    process.stdout.write('Copy completed.\n');
                });

                readStream.pipe(writeStream);

            }
        }
};
