const getValueByCLIArgs = (findName = '--') => { 
    const fullArg = process.argv.find(el => el.indexOf(findName) === 0);
    const idxOfEqual = fullArg.indexOf('=');
    if (idxOfEqual >= 0) {
        return fullArg.slice(idxOfEqual + 1)
    } 
    return undefined;
};

const parseArgs = (NameForSearch = '--') => {
    const result = process.argv.reduce((acc, cur, index) => {
        if (cur.indexOf(NameForSearch) === 0 && process.argv?.[index+1]) {
            return `${acc} ${cur.slice(2)} is ${process.argv[index+1]},`;
        }
        return acc
    }, '')
    console.log(result.slice(1, -1))
};

export {
    getValueByCLIArgs,
    parseArgs,
}
