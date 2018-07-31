import chalk from 'chalk';

export const pipe = (action: string, msg: string) => {
    if (action.length < 6) {
        action += Array(6 - action.length).fill(" ").join("");
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
    }
    return process.stdout.write(`${action} ${msg}\n`);
};
