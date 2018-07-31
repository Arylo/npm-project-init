import fs = require("fs");
import mkdirp = require("make-dir");
import path = require("path");
import constants = require("../constants");
import { dealPath, exit } from "../utils";
import * as out from "./../utils/out";

import json = require("../data");

const moveFiles = (p: string, filepaths: string[], cb?) => {
    const targetPath = constants.targetPath;
    const resourcesPath = fs.existsSync(constants.resourcesPath) ?
        constants.resourcesPath : constants.resourcesRawPath;

    mkdirp.sync(path.resolve(targetPath, p));
    out.pipe("MKDIR ", p);
    const paths = filepaths.filter((item) => {
        return new RegExp(`^${p}/[^/]+$`).test(item);
    });
    paths.forEach((item) => {
        const to = path.resolve(targetPath, item);
        if (!json.files[item]) {
            moveFiles(item, filepaths);
        } else {
            const from = path.resolve(resourcesPath, json.files[item]);
            const fromStream = fs.createReadStream(from);
            const toStream = fs.createWriteStream(to);
            toStream.on("close", () => {
                const data = fs
                    .readFileSync(to, { encoding: "utf-8" })
                    .replace(/<year>/g, constants.year)
                    .replace(/<project_name>/g, constants.projectName)
                    .replace(/<version>/g, constants.version);
                fs.writeFileSync(to, data, { encoding: "utf-8" });
            });
            out.pipe("CREATE", item);
            fromStream.pipe(toStream);
        }
    });
    if (cb && typeof cb === "function") {
        setTimeout(() => cb(), 50);
    }
};

export const handler = () => {
    const folderPath = dealPath(process.argv[3]);

    if (fs.existsSync(folderPath)) {
        exit("Folder Exist");
    }

    constants.setTargetPath(folderPath);

    const filepaths = json.list;
    moveFiles(".", filepaths, () => {
        out.pipe("CREATE", "./.git");
        require("child_process").exec(`git init -q ${folderPath}`);
        out.pipe("\n  Path:", constants.targetPath);
    });
};
