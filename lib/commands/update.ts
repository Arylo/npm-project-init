import fs = require("fs");
import mkdirp = require("make-dir");
import path = require("path");
import * as rimraf from "rimraf";
import constants = require("../constants");
import data = require("../data");
import { IObj } from "../types/config";
import { dealPath, exit } from "../utils";
import * as out from "../utils/out";
import { Pkg } from "../utils/pkg";
import { diffVersions, getVersionObj } from "../utils/versions";

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
    const ADD_MAP: IObj<string[]> = {};
    const UPDATE_MAP: IObj<string[]> = {};
    const REMOVE_MAP: IObj<string[]> = {};

    const versions = diffVersions(sourceProjectVersion);

    if (versions.length === 0 && sourceProjectVersion === constants.version) {
        return out.pipe(
            "\n    ::",
            "This is Latest Project Template"
        );
    }

    versions.forEach((version) => {
        const versionObj = getVersionObj(version);
        for (const filePoint of toUniList(versionObj.ADD_LIST)) {
            if (REMOVE_MAP[filePoint]) {
                REMOVE_MAP[filePoint] = null;
            }
            ADD_MAP[filePoint] = [version];
        }
        for (const filePoint of toUniList(versionObj.UPDATE_LIST)) {
            if (ADD_MAP[filePoint]) {
                continue;
            }
            if (!UPDATE_MAP[filePoint]) {
                UPDATE_MAP[filePoint] = [];
            }
            UPDATE_MAP[filePoint].push(version);
        }
        for (const filePoint of toUniList(versionObj.REMOVE_LIST)) {
            if (ADD_MAP[filePoint]) {
                UPDATE_MAP[filePoint] = null;
            }
            if (UPDATE_MAP[filePoint]) {
                UPDATE_MAP[filePoint] = null;
            }
            REMOVE_MAP[filePoint] = [version];
        }
    });

    // Update Files
    for (const filePoint of Object.keys(ADD_MAP)) {
        add(filePoint);
    }
    for (const filePoint of Object.keys(UPDATE_MAP)) {
        const versionList = UPDATE_MAP[filePoint];
        for (const version of versionList) {
            const versionObj = getVersionObj(version);
            if (!fs.existsSync(path.resolve(constants.targetPath, filePoint))) {
                if (!versionObj.isIgnoreCheck(filePoint)) {
                    exit(`Miss \`${filePoint}\``);
                }
                continue;
            }
            versionObj.update(filePoint.replace(/^\.\//, ""));
        }
        out.pipe(
            "UPDATE",
            filePoint
        );
    }
    for (const filePoint of Object.keys(REMOVE_MAP)) {
        remove(filePoint);
    }

    // Update `package.json`
    new Pkg(constants.targetPath)
        .modify((obj) => {
            obj.yVersion = constants.version;
            return obj;
        })
        .save();

    out.pipe(
        "\n    ::",
        `v${sourceProjectVersion} => v${constants.version} Updated`
    );

    return true;
};

const add = (filePoint: string) => {
    const rawFileName = data.files[filePoint];
    const from = path.resolve(constants.resourcesPath, rawFileName);
    const to = path.resolve(constants.targetPath, filePoint);
    if (!fs.existsSync(path.dirname(to))) {
        mkdirp.sync(path.dirname(to));
    }
    if (fs.existsSync(to)) {
        out.pipe(
            "SKIP",
            filePoint
        );
    } else {
        fs.createReadStream(from).pipe(fs.createWriteStream(to));
        out.pipe(
            "CREATE",
            filePoint
        );
    }
};

const remove = (filePoint: string) => {
    const filePath = path.resolve(constants.targetPath, filePoint);
    rimraf.sync(filePath);
    out.pipe(
        "DELETE",
        filePoint
    );
};

const toUniList = (list: string[] = []) => {
    return list.map((item) => {
        return (
            "./" +
            path
                .resolve(__dirname, item)
                .replace(__dirname, "")
                .replace(/\\/g, "/")
                .replace(/^./, "")
        );
    });
};
