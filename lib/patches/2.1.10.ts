import * as path from "path";
import constants = require("../constants");
import * as json from "../utils/json";
import { Pkg } from "../utils/pkg";

export const UPDATE_LIST = [".huskyrc.json", "package.json"];

export const update = (filePoint: string) => {
    const filePath = path.resolve(constants.targetPath, filePoint);

    switch (UPDATE_LIST.indexOf(filePoint) + 1) {
        case 1:
            const data = json.read(filePath);

            data.hooks["commit-msg"] = "commitlint -e .git/COMMIT_EDITMSG";

            json.write(filePath, data);
            break;
        case 2:
            const pkg = new Pkg(constants.targetPath);

            pkg.updateDevDependencies("@commitlint/cli", "^7.2.1");
            pkg.updateDevDependencies(
                "@commitlint/config-conventional",
                "^7.1.2"
            );
            pkg.updateDevDependencies("@commitlint/lint", "^7.2.1");

            pkg.save();
            break;
    }
};
