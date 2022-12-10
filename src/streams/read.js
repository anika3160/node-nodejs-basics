import fs from 'node:fs';
import { stat } from 'node:fs/promises';

export const readFileByStreamAPI = async (pathToReadFile) => {
    try {
        await stat(pathToReadFile);
        const readStream = fs.createReadStream(pathToReadFile);

        readStream.on('data', (chunk) => {
            process.stdout.write(chunk.toString());
        })
    
        readStream.on('end', () => {
            process.stdout.write('\n');
        })
    
        readStream.on('error', (err) => {
            throw (err);
        })
    } catch(err) {
        throw err;
    }
};