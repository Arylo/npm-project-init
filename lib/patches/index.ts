import * as fs from "fs";

interface IVersion {
    major: number;
    minor: number;
    patch: number;
}

export const getVersion = (ver: string): {
    ADD_LIST?: string[];
    UPDATE_LIST?: string[];
    REMOVE_LIST?: string[];
    add?: (filePoint: string) => any;
    update?: (filePoint: string) => any;
    remove?: (filePoint: string) => any;
} => {
    return require(`./${ver}`);
};

export const hisVersions = fs.readdirSync(__dirname)
    .filter((name) => /\d+\.\d+\.\d+\.[jt]s$/.test(name))
    .map((name) => name.replace(/\.[jt]s$/, ""));

export const diffVersions = (ver: string) => {
    const curVersion = parseVersion(ver);
    const versions = hisVersions.reduce((arr, v) => {
        arr.push(parseVersion(v));
        return arr;
    }, [ ] as IVersion[]);
    return versions.filter((v) => {
        for (const level of ["major", "minor", "patch"]) {
            if (v[level] > curVersion[level]) {
                return true;
            }
            if (v[level] < curVersion[level]) {
                return false;
            }
        }
        return false;
    }).map((v) => `${v.major}.${v.minor}.${v.patch}`);
};

const parseVersion = (ver: string) => {
    const matches = ver.match(/(\d+)\.(\d+)\.(\d+)/);
    return {
        major: parseInt(matches[1], 10),
        minor: parseInt(matches[2], 10),
        patch: parseInt(matches[3], 10)
    };
};
