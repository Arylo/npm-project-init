import * as ftconfig from "ftconfig";
import * as path from "path";
import constants = require("../constants");

export const ADD_LIST = ["LICENSE.996ICU"];

export const UPDATE_LIST = ["README.md"];

export const update = (filePoint: string) => {
    const filePath = path.resolve(constants.targetPath, filePoint);

    const se = "[![license][LICENSE_URL]][LICENSE_HREF]";
    const re = [
        "[![MIT-License][LICENSE_URL]][LICENSE_HREF]",
        "[![996ICU-License][LICENSE_996_URL]][LICENSE_996_HREF]"
    ].join("\n");

    const appendWords = [
        "",
        [
            "[LICENSE_996_URL]: ",
            "https://img.shields.io/badge/license-NPL%20(The%20996%20Prohibited%20License)-blue.svg",
            "?style=flat-square&maxAge=7200"
        ].join(""),
        "[LICENSE_996_HREF]: https://github.com/996icu/996.ICU"
    ].join("\n");

    ftconfig
        .readFile<string>(filePath)
        .modify((str) => {
            str = str.replace(se, re);

            str += appendWords;
            return str;
        })
        .save();
};
