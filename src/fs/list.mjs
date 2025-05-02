import fs from 'node:fs/promises';
import path from 'node:path';

import { getElTypeFromPath } from '../cli/path.mjs';
import { FS_OPERATION_FAILED_ERROR_TEXT_MESSAGE, DATA_TYPES } from '../constants/index.mjs';

export const getList = async (pathToDir) => {
    try {
        const files = await fs.readdir(pathToDir, {encoding: 'utf-8'});
        return files;
    }
    catch(err) {
        throw new Error(FS_OPERATION_FAILED_ERROR_TEXT_MESSAGE);
    }
};

export const printTable = async (pathToCurrentDir) => {
    const list = await getList(pathToCurrentDir);

    if (list.length > 0) {
        function Item (name, type) {
            this.Name = name;
            this.Type = type;
        }
    
        const pairsList = await Promise.all(list.map(async (el) => {
            const pathToEl = pathToCurrentDir + path.sep + el;
            const typeOfFile = await getElTypeFromPath(pathToEl);
            
            return { name: el, type: typeOfFile }
        }));

        const dirFirstSortedList = pairsList.filter((pair) => pair.type).sort((a, b) => {
            let aScore = a.type === DATA_TYPES.file ? 10 : 0;
            let bScore = b.type === DATA_TYPES.file ? 10 : 0;
            if (a.name > b.name) aScore +=1;
            if (a.name < b.name) bScore -=1;
            if (aScore > bScore) return 1;
            if (aScore < bScore) return -1
            return 0
        });

        const table = dirFirstSortedList.reduce((acc, cur, idx) => {
            acc[idx] = new Item(cur.name, cur.type);
            return acc;
        }, {});

        console.table(table);
    } else {
        console.log('Directory is empty.');
    }
}
