import * as path from "path";
import { IObj } from "./types/config";

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

export const namePipe = (name: string) => {
    return name
        .toLowerCase()
        .replace(/^[^a-z]*/i, "")
        .replace(/[^\d\w_-]/g, "");
};

/**
 * 处理位置字符串
 * @param pathname 传入位置值
 */
export const dealPath = (pathname: string) => {
    let p = pathname;
    if (!p) {
        exit("Invalid Path");
    }
    if (!path.isAbsolute(p)) {
        p = path.resolve(process.cwd(), p);
        if (!path.isAbsolute(p)) {
            exit("Invalid Path");
        }
    }
    return p;
};

export const getCommand = (
    name: string
): {
    handler(): boolean;
} & IObj => {
    return require(`./commands/${name}`);
};
