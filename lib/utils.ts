export const exit = (msg: string | string[], code = 1) => {
    if (Array.isArray(msg)) {
        // tslint:disable-next-line:no-console
        console.log(...msg);
    } else {
        // tslint:disable-next-line:no-console
        console.log(msg);
    }
    process.exit(1);
};
