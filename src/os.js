import os from 'node:os';
import { OPERATING_SYSTEM_CONSTANTS } from "./constants.js";

export const getOSInfo = (command) => {
    switch (command) {
        case OPERATING_SYSTEM_CONSTANTS.EOL: {
            console.log(JSON.stringify(os.EOL));
            break;
        }
        case OPERATING_SYSTEM_CONSTANTS.cpus: {
            const cpus = os.cpus();
            console.log('Overall amount of CPUS: ', cpus.length);
            console.log(cpus.map(cpu => {
                return ({ model: cpu.model, 'clock rate (in GHz)': cpu.speed / 1000 })
            }));
            process.stdout.write('\n');
            break;
        }
        case OPERATING_SYSTEM_CONSTANTS.homedir: {
            console.log(os.homedir());
            break;
        }
        case OPERATING_SYSTEM_CONSTANTS.username: {
            console.log(os.userInfo().username);
            break;
        }
        case OPERATING_SYSTEM_CONSTANTS.architecture: {
            console.log(os.arch());
            break;
        }
        default: {
            process.stdout.write('Invalid input\n');
        }
    }
}