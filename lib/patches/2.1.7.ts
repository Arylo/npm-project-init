import * as path from "path";
import constants = require("../constants");
import { ILintstagedrc } from "../utils/json.d";
import { Pkg } from "../utils/pkg";
import { Json } from "./../utils/json";

export const ADD_LIST = [".eslintignore"];

export const UPDATE_LIST = [".lintstagedrc", "package.json"];

export const update = (filePoint: string) => {
    const filePath = path.resolve(constants.targetPath, filePoint);

    switch (UPDATE_LIST.indexOf(filePoint) + 1) {
        case 1:
            const json = new Json<ILintstagedrc>(filePath);

            for (const key of Object.keys(json.toObject().linters)) {
                if (/\.editorconfig$/.test(key)) {
                    json.modify((obj) => {
                        delete obj.linters[key];
                        return obj;
                    });
                    continue;
                }
                let newKey: string;
                if (key.indexOf("{lib,public,scripts,test}") !== -1) {
                    newKey = key.replace("{lib,public,scripts,test}", ".");
                }
                if (key === "{,public/}*.{json,yaml,yml}") {
                    newKey = key.replace("{,public/}", "./**/");
                }
                if (key === "{,public/}.lintstagedrc") {
                    newKey = key.replace("{,public/}", "./");
                }
                json.modify((obj) => {
                    obj.linters[newKey] = obj.linters[key];
                    delete obj.linters[key];
                    return obj;
                });
            }

            json.save();
            break;
        case 2:
            new Pkg(constants.targetPath)
                .updateScript("lint:javascript", "eslint ./**/*.js")
                .save();
            break;
    }
};
