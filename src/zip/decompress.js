import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';
import { promisify } from 'node:util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const decompress = async () => {
    // Write your code here 
    const pathToDecompressFile = `${__dirname}/files/fileToCompress.txt`;
    const pathToArchive = `${__dirname}/files/archive.gz`;
    const prAccess = promisify(fs.access);

    try {
        await prAccess(pathToArchive, fs.constants.F_OK);
        const readStream = fs.createReadStream(pathToArchive);
        const writeStream = fs.createWriteStream(pathToDecompressFile); 
        const decompressStream = zlib.createUnzip();

        const handleError = (err) => {
            console.log(err);
            readStream.destroy();
            writeStream.end('Finished with error.');
        }

        readStream
            .on('error', handleError)
            .pipe(decompressStream)
            .on('error', handleError)
            .pipe(writeStream)
            .on('error', handleError)
    }
    catch (err) {
        throw err
    }
};

await decompress();