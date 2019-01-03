import ftconfig = require("ftconfig");
import * as path from "path";
import constants = require("../constants");
import { ILintstagedrc } from "../types/json";
import { Pkg } from "../utils/pkg";

export const UPDATE_LIST = [
    "package.json",
    ".lintstagedrc",
    "tsconfig.json",
    "tsconfig.prod.json",
    "tsconfig.test.json"
];

export const update = (filePoint: string) => {
    if (UPDATE_LIST.indexOf(filePoint) === -1) {
        return;
    }
    const filePath = path.resolve(constants.targetPath, filePoint);

    switch (UPDATE_LIST.indexOf(filePoint) + 1) {
        case 1:
            new Pkg(constants.targetPath)
                .updateScript("test", "ava dist/test/**/*.{spec,e2e}.js")
                .save();
            return;
        case 2:
            ftconfig
                .readFile<ILintstagedrc>(filePath, { type: "json" })
                .modify((data) => {
                    for (const key of Object.keys(data.linters)) {
                        const commands = data.linters[key];
                        const pCommands = commands.filter((item) => {
                            return /^prettier\b/.test(item);
                        });
                        const lCommands = commands.filter((item) => {
                            return /^npm run lint\b/.test(item);
                        });
                        if (pCommands.length === 0 || lCommands.length === 0) {
                            continue;
                        }
                        for (const command of pCommands) {
                            const pIndex = commands.indexOf(command);
                            const lIndex = commands.indexOf(lCommands[0]);
                            if (pIndex > lIndex) {
                                data.linters[key].splice(pIndex, 1);
                                data.linters[key].splice(lIndex, 0, command);
                            }
                        }
                    }
                    return data;
                })
                .save();
            break;
        case 3:
            ftconfig
                .readFile(filePath)
                .modify((obj) => {
                    obj.include.push("test/**/*");
                    return obj;
                })
                .save();
            break;
        case 4:
            ftconfig
                .readFile(filePath)
                .modify((obj) => {
                    obj.compilerOptions.declarationMap = false;
                    if (!obj.exclude) {
                        obj.exclude = [];
                    }
                    obj.exclude.push("test/**/*");
                    return obj;
                })
                .save();
            break;
        case 5:
            ftconfig
                .readFile(filePath)
                .modify((obj) => {
                    delete obj.include;
                    return obj;
                })
                .save();
            break;
    }
};
