import * as path from "path";
import constants = require("../constants");
import { Pkg } from "../utils/pkg";

export const UPDATE_LIST = ["package.json"];

export const update = (filePoint: string) => {
    const filePath = path.resolve(constants.targetPath, filePoint);

    new Pkg(constants.targetPath)
        .updateDevDependency("@types/node", "^10.12.12")
        .updateDevDependency("prettier", "^1.15.3")
        .updateDevDependency("eslint", "^5.10.0")
        .updateDevDependency("eslint-config-standard", "^12.0.0")
        .updateDevDependency("eslint-plugin-import", "^2.14.0")
        .updateDevDependency("eslint-plugin-node", "^8.0.0")
        .updateDevDependency("eslint-plugin-promise", "^4.0.1")
        .updateDevDependency("eslint-plugin-standard", "^4.0.0")
        .updateDevDependency("tslint", "^5.11.0")
        .updateDevDependency("typescript", "^3.2.2")
        .save();
};
