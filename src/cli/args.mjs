export const getValueByCLIArgs = (findName = '--') => { 
    const fullArg = process.argv
        .slice(2)
        .find(a => a.startsWith(`${findName}=`));

    if (!fullArg) return undefined;

    const idx = fullArg.indexOf('=');
    return idx >= 0 ? fullArg.slice(idx + 1) : undefined;
};
