import child_process = require("child_process");
import glob = require("glob");
import path = require("path");
import { handler } from "../../lib";

const TEST_PATH = path.resolve(...[
    __dirname, "../../TEST_PATH"
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

export const patchBeforeMacro = (t, vers: string | string[]) => {
    vers = Array.isArray(vers) ? vers : [ vers];
    const tmpName = `t${Math.ceil(Math.random() * 10000)}-${vers.join("-").substr(0, 30)}`;
    const projectPaths = [
        path.resolve(TEST_PATH, `${tmpName}`, "now", "aaa"),
    ];
    process.argv = [ process.argv0 , ".", "new", projectPaths[0] ];
    handler();
    for (const ver of vers) {
        if (ver === curVersion) {
            projectPaths.push(projectPaths[0]);
        } else {
            const p = path.resolve(TEST_PATH, `${tmpName}`, ver, "aaa");
            projectPaths.push(p);
            child_process.execSync(`npx arylo-init@${ver} new ${p}`);
        }
    }
    return projectPaths;
};
