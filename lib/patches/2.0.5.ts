import constants = require("../constants");
import { Pkg } from "../utils/pkg";

export const ADD_LIST = ["test/index.spec.ts"];
export const UPDATE_LIST = ["package.json"];
export const REMOVE_LIST = ["lib/.gitkeep", "test/.gitkeep"];

export const update = (filePoint: string) => {
    if (UPDATE_LIST.indexOf(filePoint) === -1) {
        return;
    }

    new Pkg(constants.targetPath)
        .updateScript("build:prod", "npm run tsc -- -P tsconfig.prod.json")
        .updateScript("build:test", "npm run tsc -- -P tsconfig.test.json")
        .updateScript(
            "pretest",
            "npm run clean && npm run build:test && npm run resource"
        )
        .updateDevDependency("typescript", "^2.9.2")
        .save();
};
