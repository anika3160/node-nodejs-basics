import fs from 'node:fs/promises';

const rename = async (pathToWrongFileName, newPath) => {
    try {
        await fs.access(newPath, fs.constants.F_OK);
        throw new Error('FS operation failed');
    }
    catch (err) {
        if (err.message === 'FS operation failed') {
            throw err
        }
    }
    await fs.rename(pathToWrongFileName, newPath);
};

export default rename;
