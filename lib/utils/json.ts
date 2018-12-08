import * as fs from "fs";
import { FILE_OPTIONS } from "../constants";
import { IAdapter } from "./adapter.d";
import { Conf } from "./config";

const adapter: IAdapter = {
    read: (p) => {
        const filePath = p;
        if (!fs.existsSync(filePath)) {
            return null;
        }
        try {
            return JSON.parse(fs.readFileSync(filePath, FILE_OPTIONS));
        } catch (error) {
            return null;
        }
    },
    write: (p, data) => {
        fs.writeFileSync(p, JSON.stringify(data, null, 2), FILE_OPTIONS);
    }
};

export class Json<T = { [key: string]: any }> extends Conf<T> {
    constructor(p: fs.PathLike) {
        super(p, adapter);
    }
}
