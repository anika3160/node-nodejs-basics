import fs from 'node:fs';
import zlib from 'node:zlib';
import { access } from 'node:fs/promises';

const decompress = async (pathToDecompressFile, pathToDestination) => {
    await access(pathToDecompressFile, fs.constants.F_OK);
    const readStream = fs.createReadStream(pathToDecompressFile);
    const writeStream = fs.createWriteStream(pathToDestination); 
    const decompressStream = zlib.createBrotliDecompress();

    const handleError = (err) => {
        console.log(err);
        readStream.destroy();
    }

    const stream = readStream.pipe(decompressStream).pipe(writeStream);

    stream.on('finish', () => {
        console.log('File created.');
    });

    stream.on('error', handleError);

};

export default decompress;
