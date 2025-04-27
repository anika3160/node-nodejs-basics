import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';
import { promisify } from 'node:util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compress = async () => {
    // Write your code here 
    const pathToCompressFile = `${__dirname}/files/fileToCompress.txt`;
    const pathToArchive = `${__dirname}/files/archive.gz`;
    const prAccess = promisify(fs.access);

    try {
        await prAccess(pathToCompressFile, fs.constants.F_OK);
        const readStream = fs.createReadStream(pathToCompressFile, {encoding:'utf-8'});
        const writeStream = fs.createWriteStream(pathToArchive);
        const compressStream = zlib.createGzip();
    
        const handleError = (err) => {
            console.log(err);
            readStream.destroy();
            writeStream.end('Finished with error.');
        }
    
        readStream
            .on('error', handleError)
            .pipe(compressStream)
            .on('error', handleError)
            .pipe(writeStream)
            .on('error', handleError)
    }
    catch (err) {
        throw err
    }
};

await compress();