import * as fs from "fs";
import * as path from "path";
import constants = require("../constants");

export const UPDATE_LIST = ["package.json"];

const FILE_OPTIONS = {
    encoding: "utf-8"
};

export const update = (filePoint: string) => {
    if (UPDATE_LIST.indexOf(filePoint) === -1) {
        return;
    }
    const filePath = path.resolve(constants.targetPath, filePoint);
    const json = JSON.parse(fs.readFileSync(filePath, FILE_OPTIONS));

    json.scripts.pretest =
        json.scripts.pretest.replace(new RegExp(" && npm run resource" + "$"), "");

    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), FILE_OPTIONS);
};
