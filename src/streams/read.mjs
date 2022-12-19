import fs from 'node:fs';
import { stat } from 'node:fs/promises';

export const readFileByStreamAPI = async (pathToReadFile) => {
    await stat(pathToReadFile);
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(pathToReadFile);

        readStream.on('data', (chunk) => {
            process.stdout.write(chunk.toString());
        });
        
        readStream.on('end', () => {
            process.stdout.write('\n');
            resolve();
        });

        readStream.on('error', (err) => {
            reject(err);
        });
    });
};