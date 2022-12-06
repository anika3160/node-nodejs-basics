const parseEnv = (NameForSearch = 'RSS_') => {
    // Write your code here 
    const arrayOfEntries = Object.entries(process.env);
    const result = arrayOfEntries.reduce((acc, cur) => {
        if (cur[0].indexOf(NameForSearch) === 0) {
            return `${acc} ${cur[0]}=${cur[1]};`;
        }
        return acc
    }, '')
    console.log(result.slice(1, -1))
};

export default parseEnv;
