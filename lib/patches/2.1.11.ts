import * as path from "path";
import constants = require("../constants");
import { Yaml } from "../utils/yaml";
import { ITravis } from "../utils/yaml.d";

export const UPDATE_LIST = [".travis.yml"];

export const update = (filePoint: string) => {
    const filePath = path.resolve(constants.targetPath, filePoint);

    new Yaml<ITravis>(filePath)
        .modify((data) => {
            data.node_js.push("10");
            data.node_js = data.node_js.sort();
            return data;
        })
        .save();
};
