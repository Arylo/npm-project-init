import * as fs from "fs";
import constants = require("../constants");

interface IVersion {
    major: number;
    minor: number;
    patch: number;
}

interface IVersionObject {
    ADD_LIST?: string[];
    UPDATE_LIST?: string[];
    REMOVE_LIST?: string[];
    IGNORE_CHECK_LIST?: string[];
    update?: (filePoint: string) => any;
}

export const getVersion = (ver: string): IVersionObject => {
    return require(`./${ver}`);
};

export const hisVersions = fs
    .readdirSync(__dirname)
    .filter((name) => /\d+\.\d+\.\d+\.[jt]s$/.test(name))
    .map((name) => name.replace(/\.[jt]s$/, ""));

export const diffVersions = (ver: string) => {
    if (ver === constants.version) {
        return [];
    }
    const curVersion = parseVersion(ver);
    return hisVersions
        .reduce<IVersion[]>((arr, v) => {
            arr.push(parseVersion(v));
            return arr;
        }, [])
        .sort((a, b) => {
            for (const level of ["major", "minor", "patch"]) {
                if (a[level] === b[level]) {
                    continue;
                }
                return a[level] - b[level];
            }
            return 0;
        })
        .filter((v) => {
            for (const level of ["major", "minor", "patch"]) {
                if (v[level] > curVersion[level]) {
                    return true;
                }
                if (v[level] < curVersion[level]) {
                    return false;
                }
            }
            return false;
        })
        .map((v) => `${v.major}.${v.minor}.${v.patch}`);
};

const parseVersion = (ver: string) => {
    const matches = ver.match(/(\d+)\.(\d+)\.(\d+)/);
    return {
        major: parseInt(matches[1], 10),
        minor: parseInt(matches[2], 10),
        patch: parseInt(matches[3], 10)
    };
};
