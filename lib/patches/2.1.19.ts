import * as ftconfig from "ftconfig";
import * as path from "path";
import constants = require("../constants");

export const UPDATE_LIST = ["tslint.json"];

export const update = (filePoint: string) => {
    const filePath = path.resolve(constants.targetPath, filePoint);

    ftconfig
        .readFile(filePath)
        .modify((obj) => {
            obj.rules = obj.rules || {};
            obj.rules["object-literal-sort-keys"] = false;
            return obj;
        })
        .save();
};
