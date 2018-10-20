import constants = require("../constants");
import { Pkg } from "../utils/pkg";

export const ADD_LIST = [".lintstagedrc", ".huskyrc.json"];
export const UPDATE_LIST = ["package.json"];

export const update = (filePoint: string) => {
    if (UPDATE_LIST.indexOf(filePoint) === -1) {
        return;
    }
    new Pkg(constants.targetPath)
        .modify((obj) => {
            if (!obj.keywords) {
                obj.keywords = [];
            }
            if (obj.keywords.indexOf("typescript") === -1) {
                obj.keywords.push("typescript");
            }
            return obj;
        })
        .updateDevDependencies("husky", "^1.1.2")
        .updateDevDependencies("lint-staged", "^7.3.0")
        .updateDevDependencies("prettier", "^1.14.3")
        .save();
};
