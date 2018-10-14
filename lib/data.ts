import * as fs from "fs";
import * as path from "path";
import * as constants from "./constants";
import { exit } from "./utils";

interface IFilesObject {
    files: {
        [key: string]: string;
    };
    list: string[];
}

const getReleaseData = (): IFilesObject => {
    const filePath = path.resolve(constants.resourcesPath, "tree.json");
    if (!fs.existsSync(filePath)) {
        exit("Miss Resource Files");
    }
    return require(filePath);
};

const getFakerData = (): IFilesObject => {
    const glob = require("glob");
    const filePaths: string[] = glob.sync("./**", {
        cwd: constants.resourcesRawPath,
        dot: true
    });

    const json = {
        files: { },
        list: filePaths
    };
    for (const filePath of filePaths) {
        const p = path.resolve(constants.resourcesRawPath, filePath);
        const stat = fs.statSync(p);
        if (stat.isFile()) {
            json.files[filePath] = filePath;
        }
    }
    return json;
};

export = fs.existsSync(constants.resourcesPath) ?
    getReleaseData() : getFakerData();
