import * as fs from "fs";
import * as path from "path";
import constants = require("../constants");
import {
    IVersion,
    IVersionExtraObject,
    IVersionObject
} from "../types/version";

/**
 * 和版本相关的方法
 */

/** */
let historyVersions: string[] = [];

/**
 * 获取已有的更新列表
 */
export const getHistoryVersions = () => {
    if (historyVersions.length === 0) {
        historyVersions = fs
            .readdirSync(path.resolve(__dirname, "../patches"))
            .filter((name) => /\d+\.\d+\.\d+\.[jt]s$/.test(name))
            .map((name) => name.replace(/\.[jt]s$/, ""));
    }
    return historyVersions;
};

/**
 * Parse 版本号
 */
export const parseVersion = (ver: string): IVersion => {
    const matches = ver.match(/(\d+)\.(\d+)\.(\d+)/);
    const verObj = {
        major: parseInt(matches[1], 10),
        minor: parseInt(matches[2], 10),
        patch: parseInt(matches[3], 10)
    };
    return Object.assign(
        {
            toString: () => {
                return `${verObj.major}.${verObj.minor}.${verObj.patch}`;
            }
        },
        verObj
    );
};

export const getVersionObj = (ver: string): IVersionExtraObject => {
    const obj = require(`../patches/${ver}`) as IVersionObject;
    return Object.assign(
        {
            isIgnoreCheck: (filePoint: string) => {
                if (!obj.IGNORE_CHECK_LIST) {
                    return false;
                }
                return (
                    Array.from(obj.IGNORE_CHECK_LIST)
                        .map((item) => path.resolve(constants.targetPath, item))
                        .indexOf(
                            path.resolve(constants.targetPath, filePoint)
                        ) !== -1
                );
            }
        },
        obj
    );
};

export const diffVersions = (ver: string) => {
    if (ver === constants.version) {
        return [];
    }
    const curVersion = parseVersion(ver);
    return getHistoryVersions()
        .reduce<IVersion[]>((arr, v) => {
            arr.push(parseVersion(v));
            return arr;
        }, [])
        .sort(sortFn())
        .filter(filterFn(curVersion))
        .map((v) => v.toString());
};

export const sortFn = (asc = true) => {
    return (a: IVersion, b: IVersion) => {
        for (const level of ["major", "minor", "patch"]) {
            if (a[level] === b[level]) {
                continue;
            }
            return asc ? a[level] - b[level] : b[level] - a[level];
        }
        return 0;
    };
};

export const filterFn = (baseVersion: IVersion) => {
    return (v) => {
        for (const level of ["major", "minor", "patch"]) {
            if (v[level] > baseVersion[level]) {
                return true;
            }
            if (v[level] < baseVersion[level]) {
                return false;
            }
        }
        return false;
    };
};
