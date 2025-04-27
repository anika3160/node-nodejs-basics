import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const spawnChildProcess = async (args) => {
    // Write your code here 
    if (args?.length && typeof args !== 'string') {
        const childProcess = spawn('node', [`${__dirname}/files/script.js`, ...args]);
        process.stdin.pipe(childProcess.stdin);
        childProcess.stdout.pipe(process.stdout);
    } else {
        throw new Error('Function spawnChildProcess expects to receive an array')
    }
};

// Put your arguments in function call to test this functionality
await spawnChildProcess([1,3,7]);
