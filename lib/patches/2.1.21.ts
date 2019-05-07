import * as ftconfig from "ftconfig";
import * as path from "path";
import constants = require("../constants");

export const ADD_LIST = ["_scripts/README.md", "_scripts/commitlint.config.js"];

export const UPDATE_LIST = [".huskyrc.json"];

export const update = (filePoint: string) => {
    const filePath = path.resolve(constants.targetPath, filePoint);

    ftconfig
        .readFile(filePath)
        .modify((obj) => {
            if (
                obj.hooks &&
                obj.hooks["commit-msg"] &&
                /\bcommitlint\b/.test(obj.hooks["commit-msg"])
            ) {
                obj.hooks["commit-msg"] = obj.hooks["commit-msg"].replace(
                    /\bcommitlint\b/,
                    `commitlint --config ${ADD_LIST[1]}`
                );
            }
            return obj;
        })
        .save();
};
