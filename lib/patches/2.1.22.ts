import constants = require("../constants");
import { Pkg } from "../utils/pkg";

export const UPDATE_LIST = ["package.json"];

export const update = (filePoint: string) => {
    new Pkg(constants.targetPath)
        .updateDevDependency("@commitlint/cli", "^8.0.0")
        .updateDevDependency("@commitlint/config-conventional", "^8.0.0")
        .updateDevDependency("@commitlint/lint", "^8.0.0")
        .updateDevDependency("@types/node", "^12.0.4")
        .updateDevDependency("ava", "^1.4.1")
        .updateDevDependency("husky", "^2.3.0")
        .updateDevDependency("lint-staged", "^8.1.7")
        .updateDevDependency("prettier", "^1.17.1")
        .updateDevDependency("rimraf", "^2.6.3")
        .updateDevDependency("tslint", "^5.17.0")
        .updateDevDependency("typescript", "^3.5.1")
        .save();
};
