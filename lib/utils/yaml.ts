import * as fs from "fs";
// import YAML = require("yaml");
import YAML = require("js-yaml");
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
            return YAML.safeLoad(fs.readFileSync(filePath, FILE_OPTIONS));
        } catch (error) {
            return null;
        }
    },
    write: (p, data) => {
        fs.writeFileSync(p, YAML.safeDump(data), FILE_OPTIONS);
    }
};

export class Yaml<T = { [key: string]: any }> extends Conf<T> {
    constructor(p: fs.PathLike) {
        super(p, adapter);
    }
}
