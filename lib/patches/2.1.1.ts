import constants = require("../constants");
import { Pkg } from "../utils/pkg";

export const UPDATE_LIST = ["package.json"];

export const update = (filePoint: string) => {
    const pkg = new Pkg(constants.targetPath);
    const data = pkg.toObject();

    pkg.updateScript(
        "pretest",
        pkg
            .getScript("pretest")
            .replace(new RegExp(" && npm run resource" + "$"), "")
    ).save();
};
