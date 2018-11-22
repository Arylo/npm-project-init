import * as path from "path";
import constants = require("../constants");
import * as json from "../utils/json";
import { Pkg } from "../utils/pkg";

export const UPDATE_LIST = [".huskyrc.json"];

export const update = (filePoint: string) => {
    const filePath = path.resolve(constants.targetPath, filePoint);

    const data = json.read(filePath);

    data.hooks["pre-merge"] = "lint-staged";

    json.write(filePath, data);
};
