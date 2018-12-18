import ftconfig = require("ftconfig");
import * as path from "path";
import constants = require("../constants");
import { IHuskyrc } from "../utils/json.d";

export const UPDATE_LIST = [".huskyrc.json"];

export const update = (filePoint: string) => {
    const filePath = path.resolve(constants.targetPath, filePoint);

    ftconfig
        .readFile<IHuskyrc>(filePath)
        .modify((obj) => {
            obj.hooks["pre-merge"] = "lint-staged";
            return obj;
        })
        .save();
};
