import chalk from "chalk";

export const pipe = (action: string, msg: string) => {
    if (action.length < 6) {
        let spaceNum = action.length;
        if (action.indexOf("\n") !== -1) {
            const matches = action.match(/\n(.*?)$/);
            spaceNum = matches[1].length;
        }
        if (spaceNum >= 0) {
            action += Array(6 - spaceNum).fill(" ").join("");
        }
    }
    switch (action.trim()) {
        case "MKDIR":
            action = chalk.yellow(action);
            break;
        case "CREATE":
            action = chalk.cyan(action);
            break;
        case "UPDATE":
            action = chalk.green(action);
            break;
        case "DELETE":
            action = chalk.red(action);
            break;
        case "SKIP":
            action = chalk.magenta(action);
            break;
    }
    return process.stdout.write(`${action} ${msg}\n`);
};
