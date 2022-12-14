import { unlink } from 'node:fs/promises';

const deleteFile = async (pathToDeleteFile) => {
    await unlink(pathToDeleteFile);
    process.stdout.write(`${pathToDeleteFile} file deleted.\n`)
};

export default deleteFile;
