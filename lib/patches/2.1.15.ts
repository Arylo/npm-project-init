import * as ftconfig from "ftconfig";
import * as path from "path";
import constants = require("../constants");
import { Pkg } from "../utils/pkg";

export const IGNORE_CHECK_LIST = ["test/index.spec.ts"];

export const UPDATE_LIST = ["package.json", "test/index.spec.ts"];

export const update = (filePoint: string) => {
    const filePath = path.resolve(constants.targetPath, filePoint);

    switch (UPDATE_LIST.indexOf(filePoint) + 1) {
        case 1:
            new Pkg(constants.targetPath)
                .updateDevDependency("ava", "^1.0.1")
                .save();
            break;
        case 2:
            ftconfig
                .readFile<string>(filePath, { type: "raw" })
                .modify((str) => {
                    str = str.replace(
                        /\btest\(\(t\)\s*=>\s*{(\s*)/g,
                        `test("Default test", (t) => {$1`
                    );
                    return str;
                })
                .save();
            break;
    }
};
