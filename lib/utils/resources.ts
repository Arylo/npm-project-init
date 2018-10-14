import * as fs from "fs";
import mkdirp = require("make-dir");
import * as path from "path";
import constants = require("../constants");
import json = require("../data");
import * as out from "./../utils/out";

export const moveFiles = (targetPath: string, cb?) => {
    Object.keys(json.files).forEach((p) => {
        const newPath = path.resolve(targetPath, p);
        const newFileDirPath = path.dirname(newPath);
        if (!fs.existsSync(newFileDirPath)) {
            mkdirp.sync(newFileDirPath);
            const hintPath = newFileDirPath
                .replace(targetPath, "")
                .replace(path.sep, "/");
            out.pipe("MKDIR ", "." + hintPath);
        }
        // Copy File
        const from = path.resolve(constants.resourcesPath, json.files[p]);
        const to = newPath;
        const data = fs
            .readFileSync(from, { encoding: "utf-8" })
            .replace(/<year>/g, constants.year)
            .replace(/<project_name>/g, constants.projectName)
            .replace(/<version>/g, constants.version);
        fs.writeFileSync(to, data, { encoding: "utf-8" });
        out.pipe("CREATE", p);
    });

    json.list.forEach((p) => {
        const newPath = path.resolve(targetPath, p);
        if (!fs.existsSync(newPath)) {
            mkdirp.sync(newPath);
            const hintPath = newPath
                .replace(targetPath, "")
                .replace(path.sep, "/");
            out.pipe("MKDIR ", "." + hintPath);
        }
    });

    if (cb && typeof cb === "function") {
        cb();
    }

};
