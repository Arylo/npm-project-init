import constants = require("../constants");
import * as pkg from "../utils/pkg";

export const ADD_LIST = ["test/index.spec.ts"];
export const UPDATE_LIST = ["package.json"];
export const REMOVE_LIST = ["lib/.gitkeep" , "test/.gitkeep"];

export const update = (filePoint: string) => {
    if (UPDATE_LIST.indexOf(filePoint) === -1) {
        return;
    }

    const json = pkg.read(constants.targetPath);

    json.scripts["build:prod"] = "npm run tsc -- -P tsconfig.prod.json",
    json.scripts["build:test"] = "npm run tsc -- -P tsconfig.test.json",
    json.scripts.pretest = "npm run clean && npm run build:test && npm run resource",
    json.devDependencies.typescript = "^2.9.2";

    pkg.write(constants.targetPath, json);
};
