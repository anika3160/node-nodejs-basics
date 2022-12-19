import fs from 'node:fs/promises';

const create = async (pathToFile) => {
    try {
        await fs.access(pathToFile, fs.constants.F_OK);
    }
    catch (err) {
        await fs.writeFile(pathToFile, '');
        process.stdout.write('File created.\n');
        return; 
    }
    throw new Error('FS operation failed'); 
};

export default create;
