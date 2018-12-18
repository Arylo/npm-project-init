import ftconfig = require("ftconfig");
import * as path from "path";
import constants = require("../constants");
import { Pkg } from "../utils/pkg";

export const UPDATE_LIST = [".huskyrc.json", "package.json"];

export const update = (filePoint: string) => {
    const filePath = path.resolve(constants.targetPath, filePoint);

    switch (UPDATE_LIST.indexOf(filePoint) + 1) {
        case 1:
            ftconfig
                .readFile(filePath)
                .modify((data) => {
                    data.hooks["commit-msg"] =
                        "commitlint -e .git/COMMIT_EDITMSG";
                    return data;
                })
                .save();
            break;
        case 2:
            new Pkg(constants.targetPath)
                .updateDevDependency("@commitlint/cli", "^7.2.1")
                .updateDevDependency(
                    "@commitlint/config-conventional",
                    "^7.1.2"
                )
                .updateDevDependency("@commitlint/lint", "^7.2.1")
                .save();
            break;
    }
};
