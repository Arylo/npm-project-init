import ftconfig = require("ftconfig");
import * as path from "path";
import constants = require("../constants");
import { ITravis } from "../types/yaml";

export const UPDATE_LIST = [".travis.yml"];

export const update = (filePoint: string) => {
    const filePath = path.resolve(constants.targetPath, filePoint);

    ftconfig
        .readFile<ITravis>(filePath)
        .modify((data) => {
            data.node_js.push("10");
            data.node_js = data.node_js.sort();
            return data;
        })
        .save();
};
