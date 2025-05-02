export const getValueByCLIArgs = (findName = '--') => { 
    const fullArg = process.argv.find(el => el.indexOf(findName) === 0);
    const idxOfEqual = fullArg.indexOf('=');
    if (idxOfEqual >= 0) {
        return fullArg.slice(idxOfEqual + 1)
    } 
    return undefined;
};
