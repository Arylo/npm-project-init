import child_process = require("child_process");
import glob = require("glob");
import path = require("path");
import { handler } from "../../lib";

const TEST_PATH = path.resolve(...[
    __dirname, "../../TEST_PATCHES_PATH"
]);

const numberGlobPattern = "[1-9]+([0-9])";
const NGP = numberGlobPattern;
// 当前版本号
export const curVersion = process.env.npm_package_version;
// 历史版本号
export const hisVersions = glob.sync(`@([2-9]|${NGP}).@([0-9]|${NGP}).@([4-9]|${NGP}).spec.[jt]s`, {
    cwd: __dirname,
    dot: true
}).map((v) => {
    return v.replace(/\.spec\.[jt]s/, "");
}).filter((v) => {
    return v === curVersion ? false : true;
});

export const patchBeforeMacro = (t, ver: string) => {
    const tmpName = `t${Math.ceil(Math.random() * 10000)}`;
    const projectPaths = [
        path.resolve(TEST_PATH, `tmpName-${ver}`, "now", "aaa"),
        path.resolve(TEST_PATH, `tmpName-${ver}`, ver, "aaa"),
    ];
    process.argv = [ process.argv0 , ".", "new", projectPaths[0] ];
    handler();
    if (ver === curVersion) {
        projectPaths[1] = projectPaths[0];
    } else {
        child_process.execSync(`npx arylo-init@${ver} new ${projectPaths[1]}`);
    }
    return projectPaths;
};
