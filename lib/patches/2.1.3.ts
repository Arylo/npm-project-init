import { resolve } from "path";
import constants = require("../constants");
import { Json } from "../utils/json";

export const UPDATE_LIST = ["package.json", "tsconfig.json"];

export const update = (filePoint: string) => {
    if (UPDATE_LIST.indexOf(filePoint) === -1) {
        return;
    }

    const filePath = resolve(constants.targetPath, filePoint);

    new Json(filePath)
        .modify((data) => {
            switch (UPDATE_LIST.indexOf(filePoint) + 1) {
                case 1:
                    data.devDependencies.typescript = "^3.1.3";
                    break;
                case 2:
                    data.compilerOptions.declaration = true;
                    data.compilerOptions.declarationMap = true;
                    break;
            }
            return data;
        })
        .save();
};
