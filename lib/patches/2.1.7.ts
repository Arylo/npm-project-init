import * as path from "path";
import constants = require("../constants");
import * as json from "../utils/json";
import { Pkg } from "../utils/pkg";

export const ADD_LIST = [".eslintignore"];

export const UPDATE_LIST = [".lintstagedrc", "package.json"];

export const update = (filePoint: string) => {
    const filePath = path.resolve(constants.targetPath, filePoint);

    switch (UPDATE_LIST.indexOf(filePoint) + 1) {
        case 1:
            const data = json.read(filePath);

            for (const key of Object.keys(data.linters)) {
                if (/\.editorconfig$/.test(key)) {
                    delete data.linters[key];
                    continue;
                }
                if (key.indexOf("{lib,public,scripts,test}") !== -1) {
                    const newKey = key.replace(
                        "{lib,public,scripts,test}",
                        "."
                    );
                    data.linters[newKey] = data.linters[key];
                    delete data.linters[key];
                    continue;
                }
                if (key === "{,public/}*.{json,yaml,yml}") {
                    const newKey = key.replace("{,public/}", "./**/");
                    data.linters[newKey] = data.linters[key];
                    delete data.linters[key];
                    continue;
                }
                if (key === "{,public/}.lintstagedrc") {
                    const newKey = key.replace("{,public/}", "./");
                    data.linters[newKey] = data.linters[key];
                    delete data.linters[key];
                    continue;
                }
            }

            json.write(filePath, data);
            break;
        case 2:
            const pkg = new Pkg(constants.targetPath);

            pkg.updateScript("lint:javascript", "eslint ./**/*.js");

            pkg.save();
            break;
    }
};
