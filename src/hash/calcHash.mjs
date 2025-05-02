import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Writable } from 'node:stream';

const calculateHash = async (pathToFile) => {
    const hash = createHash('sha256');

    const output = new Writable({
        write(chunk, encoding, callback) {
            hash.update(chunk);
            callback();
        }
    });

    await pipeline(
        createReadStream(pathToFile),
        output
    );

    process.stdout.write(hash.digest('hex') + '\n');
};

export default calculateHash;
