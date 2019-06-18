import * as ftconfig from "ftconfig";
import * as path from "path";
import constants = require("../constants");
import { ILintstagedrc } from "../types/json";

export const ADD_LIST = ["_scripts/.prettierrc.yml"];

export const UPDATE_LIST = [".lintstagedrc"];

export const modifyHandler = (obj: ILintstagedrc) => {
    if (!obj.linters) {
        return obj;
    }
    for (const key of Object.keys(obj.linters)) {
        obj.linters[key] = obj.linters[key].map((cmd) => {
            if (/\bprettier\s/.test(cmd) && !/\bprettier\s[^&]*--config\s/.test(cmd)) {
                cmd = cmd.replace(/\b(prettier\s)/, `$1--config ${ADD_LIST[0]} `);
            }
            return cmd;
        });
    }
    return obj;
};

export const update = (filePoint: string) => {
    const filePath = path.resolve(constants.targetPath, filePoint);
    ftconfig
        .readFile<ILintstagedrc>(filePath, { type: "json" })
        .modify(modifyHandler)
        .save();
};
