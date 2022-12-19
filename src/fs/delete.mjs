import { unlink } from 'node:fs/promises';

const deleteFile = async (pathToDeleteFile, skipMessage) => {
    await unlink(pathToDeleteFile);
    if (!skipMessage) process.stdout.write(`${pathToDeleteFile} file deleted.\n`)
};

export default deleteFile;
