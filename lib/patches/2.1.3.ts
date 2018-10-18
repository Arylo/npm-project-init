import * as json from "../utils/json";
import constants = require("../constants");
import { resolve } from 'path';

export const UPDATE_LIST = ["package.json", "tsconfig.json"];

export const update = (filePoint: string) => {
    if (UPDATE_LIST.indexOf(filePoint) === -1) {
        return;
    }

    const filePath = resolve(constants.targetPath, filePoint);

    const data = json.read(filePath);

    switch(UPDATE_LIST.indexOf(filePoint) + 1) {
        case 1:
            data.devDependencies.typescript = "^3.1.3";
            break;
        case 2:
            data.compilerOptions.declaration = true;
            data.compilerOptions.declarationMap = true;
            break;
    }

    json.write(filePath, data);
};
