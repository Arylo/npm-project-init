import * as path from "path";
import constants = require("../constants");
import * as json from "../utils/json";

export const ADD_LIST = [".lintstagedrc", ".huskyrc.json"];
export const UPDATE_LIST = ["package.json"];

export const update = (filePoint: string) => {
    if (UPDATE_LIST.indexOf(filePoint) === -1) {
        return;
    }
    const filePath = path.resolve(constants.targetPath, filePoint);
    const data = json.read(filePath);

    if (!data.keywords) {
        data.keywords = [];
    }
    if (data.keywords.indexOf("typescript") === -1) {
        data.keywords.push("typescript");
    }
    data.devDependencies.husky = "^1.1.2";
    data.devDependencies["lint-staged"] = "^7.3.0";
    data.devDependencies.prettier = "^1.14.3";

    json.write(filePath, data);
};
