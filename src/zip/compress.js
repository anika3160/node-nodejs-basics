import fs from 'node:fs';
import zlib from 'node:zlib';
import { access } from 'node:fs/promises';


const compress = async (pathToCompressFile, pathToDestination) => {
    await access(pathToCompressFile, fs.constants.F_OK);
    const readStream = fs.createReadStream(pathToCompressFile, {encoding:'utf-8'});
    const writeStream = fs.createWriteStream(pathToDestination);
    const compressStream = zlib.createBrotliCompress();

    const stream = readStream.pipe(compressStream).pipe(writeStream);
    
    const handleError = (err) => {
        console.log(err);
        stream.destroy();
    }
    
    stream.on('finish', () => {
        console.log('File created.');
    });

    stream.on('error', handleError);
};

export default compress;