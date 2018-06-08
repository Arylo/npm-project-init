import * as fs from "fs";
import * as path from "path";
import * as constants from "./constants";

const getReleaseData = () => {
    const filepath = path.resolve(constants.resourcesPath, "tree.json");
    return require(filepath);
};

const getFakerData = () => {
    const glob = require("glob");
    const filepaths = glob.sync("./**", {
        cwd: constants.resourcesRawPath,
        dot: true
    });

    const json = {
        files: { },
        list: filepaths
    };
    for (const filepath of filepaths) {
        const p = path.resolve(constants.resourcesRawPath, filepath);
        const stat = fs.statSync(p);
        if (stat.isFile()) {
            json.files[filepath] = filepath;
        }
    }
    return json;
};

export = fs.existsSync(constants.resourcesPath) ?
    getReleaseData() : getFakerData();
