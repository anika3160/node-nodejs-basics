import fs from 'node:fs/promises';
import path from 'node:path';

export const getList = async (pathToDir) => {
    try {
        const files = await fs.readdir(pathToDir, {encoding: 'utf-8'});
        return files;
    }
    catch(err) {
        throw new Error('FS operation failed');
    }
};

const getElTypeFromPath = async (pathToEl) => {
    let isDir, isFile = false;
    try {
        const stat = await fs.lstat(pathToEl);
        isDir = stat.isDirectory();
        if (isDir) return 'directory';
        isFile = stat.isFile();
        if (isFile) return 'file';
    } catch(err) {
        throw err
    }
}

export const printTable = async (pathToCurrentDir) => {
    const list = await getList(pathToCurrentDir);

    if (list.length > 0) {
        function Item (name, type) {
            this.Name = name;
            this.Type = type;
        }
    
        const promises = list.map(async (el) => {
            const pathToEl = pathToCurrentDir + path.sep + el;
            const typeOfFile = await getElTypeFromPath(pathToEl);
            
            return { name: el, type: typeOfFile }
        });
    
        Promise.all(promises).then((arrayOfObj) => {
            const sortedArray = arrayOfObj.sort((a, b) => {
                let aScore = a.type === 'file' ? 10 : 0;
                let bScore = b.type === 'file' ? 10 : 0;
                if (a.name > b.name) aScore +=1;
                if (a.name < b.name) bScore -=1;
                if (aScore > bScore) return 1;
                if (aScore < bScore) return -1
                return 0
            }); 
            const table = sortedArray.reduce((acc, cur, idx) => {
                acc[idx] = new Item(cur.name, cur.type);
                return acc;
            }, {})
            console.table(table);
        });
    } else {
        console.log('Directory is empty.');
    }
}
