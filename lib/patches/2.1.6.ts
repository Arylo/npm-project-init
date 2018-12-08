import * as path from "path";
import constants = require("../constants");
import { Json } from "../utils/json";
import { IHuskyrc } from "../utils/json.d";

export const UPDATE_LIST = [".huskyrc.json"];

export const update = (filePoint: string) => {
    const filePath = path.resolve(constants.targetPath, filePoint);

    new Json<IHuskyrc>(filePath)
        .modify((obj) => {
            obj.hooks["pre-merge"] = "lint-staged";
            return obj;
        })
        .save();
};
