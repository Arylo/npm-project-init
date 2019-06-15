import * as ftconfig from "ftconfig";
import * as path from "path";
import constants = require("../constants");
import { IPackage } from "../types/json";
import { ITravis } from "../types/yaml";

export const UPDATE_LIST = [".travis.yml", "package.json"];

export const update = (filePoint: string) => {
    const filePath = path.resolve(constants.targetPath, filePoint);
    switch (filePoint) {
        case UPDATE_LIST[0]: {
            ftconfig
                .readFile<ITravis>(filePath)
                .modify((obj) => {
                    if (obj.before_script && Array.isArray(obj.before_script)) {
                        obj.before_script = obj.before_script.map((str) => {
                            str = str.replace(
                                "install nyc ",
                                "install nyc@13 "
                            );
                            return str;
                        });
                    }

                    if (obj.node_js && Array.isArray(obj.node_js)) {
                        const set = new Set(obj.node_js);
                        set.add("12");
                        obj.node_js = [...set].sort();
                    }
                    return obj;
                })
                .save();
            break;
        }
        case UPDATE_LIST[1]: {
            ftconfig
                .readFile<IPackage>(filePath)
                .modify((obj) => {
                    if (obj.scripts && obj.scripts.test) {
                        obj.scripts.test = obj.scripts.test.replace(
                            "ava dist/test/**/*.{spec,e2e}.js",
                            `ava 'dist/test/**/*.{spec,e2e}.js'`
                        );
                    }
                    return obj;
                })
                .save();
        }
    }
};
