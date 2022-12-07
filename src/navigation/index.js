import path from 'node:path';
import { getList } from "../fs/list.js";

export const getNewPathFromCdNavigation = async (dataString, pathToCurrentDir) => {
    const arrayOfInputElms = dataString.split(" ");
    const nameOrPathOfSelectDir = arrayOfInputElms[1];
    let newPathToCurrentDir;

    if (nameOrPathOfSelectDir?.[0] === '/') {
        try {
            await getList(nameOrPathOfSelectDir);
            newPathToCurrentDir = nameOrPathOfSelectDir;
        } 
        catch(err) {
            throw err;
        }
    } else {
        const list = await getList(pathToCurrentDir);
        const nameOfSelectDir = nameOrPathOfSelectDir;

        if (list.includes(nameOfSelectDir)) {
            newPathToCurrentDir = path.join(pathToCurrentDir, `/${nameOfSelectDir}`);
        }
    }
    return newPathToCurrentDir;
}
