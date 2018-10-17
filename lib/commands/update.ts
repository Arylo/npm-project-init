import fs = require("fs");
import path = require("path");
import constants = require("../constants");
import { dealPath, exit } from "../utils";
import * as out from "./../utils/out";

import { diffVersions, getVersion } from "../patches";

export const handler = () => {
    const folderPath = dealPath(process.argv[3]);
    if (!fs.existsSync(folderPath)) {
        exit("Folder Unexist");
    }

    constants.setTargetPath(folderPath);

    const pkgPath = path.resolve(folderPath, "package.json");
    if (!fs.existsSync(pkgPath)) {
        exit("Miss `package.json`");
    }
    const sourceProjectVersion = JSON.parse(
        fs.readFileSync(pkgPath, { encoding: "utf-8" })
    ).yVersion;
    if (!sourceProjectVersion) {
        exit("Miss yVersion Param in `package.json`");
    }
    const ADD_MAP = { };
    const UPDATE_MAP = { };
    const REMOVE_MAP = { };

    const versions = diffVersions(sourceProjectVersion);

    if (versions.length === 0 && sourceProjectVersion === constants.version) {
        return out.pipe("\n    ::", "This is Latest Project Template");
    }

    versions.forEach((version) => {
        const versionObj = getVersion(version);
        for (const filePoint of versionObj.ADD_LIST || [ ]) {
            if (REMOVE_MAP[filePoint]) {
                REMOVE_MAP[filePoint] = null;
            }
            ADD_MAP[filePoint] = [ version ];
        }
        for (const filePoint of versionObj.UPDATE_LIST || [ ]) {
            if (ADD_MAP[filePoint]) {
                continue;
            }
            if (!UPDATE_MAP[filePoint]) {
                UPDATE_MAP[filePoint] = [ ];
            }
            UPDATE_MAP[filePoint].push(version);
        }
        for (const filePoint of versionObj.REMOVE_LIST || [ ]) {
            if (ADD_MAP[filePoint]) {
                UPDATE_MAP[filePoint] = null;
            }
            if (UPDATE_MAP[filePoint]) {
                UPDATE_MAP[filePoint] = null;
            }
            REMOVE_MAP[filePoint] = [ version ];
        }
    });

    for (const filePoint of Object.keys(ADD_MAP)) {
        const versionList = ADD_MAP[filePoint];
        for (const version of versionList) {
            getVersion(version).add(filePoint);
        }
        out.pipe("CREATE", "./" +  filePoint);
    }
    for (const filePoint of Object.keys(UPDATE_MAP)) {
        const versionList = UPDATE_MAP[filePoint];
        if (!fs.existsSync(path.resolve(constants.targetPath, filePoint))) {
            exit(`Miss \`./${filePoint}\``);
        }
        for (const version of versionList) {
            getVersion(version).update(filePoint);
        }
        out.pipe("UPDATE", "./" +  filePoint);
    }
    for (const filePoint of Object.keys(REMOVE_MAP)) {
        const versionList = REMOVE_MAP[filePoint];
        for (const version of versionList) {
            getVersion(version).remove(filePoint);
        }
        out.pipe("DELETE", "./" +  filePoint);
    }

    const FILE_OPTIONS = {
        encoding: "utf-8"
    };
    const filePath = path.resolve(constants.targetPath, "package.json");
    const json = JSON.parse(fs.readFileSync(filePath, FILE_OPTIONS));

    json.yVersion = constants.version;

    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), FILE_OPTIONS);
    out.pipe("\n    ::", `v${sourceProjectVersion} => v${constants.version} Updated`);

    return true;
};
