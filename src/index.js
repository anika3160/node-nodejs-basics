import { getValueByCLIArgs } from "./cli/args.js";
import { FLAG_CONSTANTS} from "./constants.js";

const username = getValueByCLIArgs(FLAG_CONSTANTS.USERNAME_FLAG);

const fileManager = async () => {
    process.stdout.write(`Welcome to the File Manager, ${username}!\n`);
};

await fileManager();
