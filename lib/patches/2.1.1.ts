import * as path from "path";
import constants = require("../constants");
import * as json from "../utils/json";

export const UPDATE_LIST = ["package.json"];

export const update = (filePoint: string) => {
    if (UPDATE_LIST.indexOf(filePoint) === -1) {
        return;
    }
    const filePath = path.resolve(constants.targetPath, filePoint);
    const data = json.read(filePath);

    data.scripts.pretest = data.scripts.pretest.replace(
        new RegExp(" && npm run resource" + "$"),
        ""
    );

    json.write(filePath, data);
};
