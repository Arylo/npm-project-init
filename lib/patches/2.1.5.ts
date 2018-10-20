import * as path from "path";
import constants = require("../constants");
import * as json from "../utils/json";

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
    const data = json.read(filePath);

    switch (UPDATE_LIST.indexOf(filePoint) + 1) {
        case 1:
            data.scripts.test = "ava dist/test/**/*.{spec,e2e}.js";
            break;
        case 2:
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
            break;
        case 3:
            data.include.push("test/**/*");
            break;
        case 4:
            data.compilerOptions.declarationMap = false;
            if (!data.exclude) {
                data.exclude = [];
            }
            data.exclude.push("test/**/*");
            break;
        case 5:
            delete data.include;
            break;
    }

    json.write(filePath, data);
};
