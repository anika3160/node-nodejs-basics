import fs from 'node:fs/promises';

import { isPathExist ,getElTypeFromPath } from '../cli/path.mjs';
import { DATA_TYPES } from '../constants/index.mjs';

const rename = async (pathToRename, newPath) => {
    if (await isPathExist(pathToRename)
        && !await isPathExist(newPath)
        && await getElTypeFromPath(pathToRename) === DATA_TYPES.file) {
            await fs.rename(pathToRename, newPath);
            process.stdout.write('Renamed.\n');
    } else {
        throw new Error ('Can not rename.');
    }
};

export default rename;
