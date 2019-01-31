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
import { diffVersions, getVersionObj, sortFn } from "../utils/versions";

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
    const MAPS: { [type: string]: IObj<string[]> } = {
        add: {},
        remove: {},
        update: {}
    };

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
            if (MAPS.remove[filePoint]) {
                MAPS.remove[filePoint] = null;
            }
            MAPS.add[filePoint] = [version];
        }
        for (const filePoint of toUniList(versionObj.UPDATE_LIST)) {
            if (MAPS.add[filePoint]) {
                continue;
            }
            if (!MAPS.update[filePoint]) {
                MAPS.update[filePoint] = [];
            }
            MAPS.update[filePoint].push(version);
        }
        for (const filePoint of toUniList(versionObj.REMOVE_LIST)) {
            if (MAPS.add[filePoint]) {
                MAPS.update[filePoint] = null;
            }
            if (MAPS.update[filePoint]) {
                MAPS.update[filePoint] = null;
            }
            MAPS.remove[filePoint] = [version];
        }
    });

    // Generate Update Queue
    const updateQueue: {
        [ver: string]: Array<{ filePoint: string; type: string }>;
    } = {};
    for (const t of Object.keys(MAPS)) {
        const map = MAPS[t];
        for (const filePoint of Object.keys(map)) {
            const versionList = map[filePoint];
            for (const version of versionList) {
                if (!updateQueue[version]) {
                    updateQueue[version] = [];
                }
                updateQueue[version].push({
                    filePoint,
                    type: t
                });
            }
        }
    }

    // Update Files
    for (const ver of Object.keys(updateQueue).sort(sortFn())) {
        for (const obj of updateQueue[ver]) {
            const { filePoint } = obj;
            switch (obj.type) {
                case "add":
                    add(filePoint);
                    break;
                case "update":
                    const versionObj = getVersionObj(ver);
                    if (
                        !fs.existsSync(
                            path.resolve(constants.targetPath, filePoint)
                        )
                    ) {
                        if (!versionObj.isIgnoreCheck(filePoint)) {
                            exit(`Miss \`${filePoint}\``);
                        }
                        continue;
                    }
                    versionObj.update(filePoint.replace(/^\.\//, ""));
                    out.pipe(
                        "UPDATE",
                        filePoint
                    );
                    break;
                case "remove":
                    remove(filePoint);
                    break;
            }
        }
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
