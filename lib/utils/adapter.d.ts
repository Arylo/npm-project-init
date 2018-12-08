import * as fs from "fs";

export interface IAdapter<T = any> {
    read: (p: fs.PathLike) => T;
    write: (p: fs.PathLike, data: T) => any;
}
