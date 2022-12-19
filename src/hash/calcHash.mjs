import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';

const calculateHash = async (pathToFile) => {
    const data = await fs.readFile(pathToFile, { encoding: 'utf-8'});
    console.log(createHash('sha256').update(data).digest('hex'));
};

export default calculateHash;
