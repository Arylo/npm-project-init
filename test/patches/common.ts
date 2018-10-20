import test from "ava";
import child_process = require("child_process");
import dtss = require("dtss");
import fs = require("fs");
import glob = require("glob");
import path = require("path");
import rp = require("request-promise-native");
import { URL } from "url";
import Config = require("y-config");
import { handler } from "../../lib";
import { TEST_TEMP_PATH } from "../common";

const numberGlobPattern = "[1-9]+([0-9])";
const NGP = numberGlobPattern;
// 当前版本号
export const curVersion = process.env.npm_package_version;
// 最新版本号
export let remoteVersion: string = null;
export const getRemoveVersion = async () => {
    const url = new URL("arylo-init", process.env.npm_config_registry);
    try {
        let body = await rp({
            headers: {
                "Cache-Control": "max-age=0",
                "Connection": "keep-alive"
            },
            method: "GET",
            timeout: dtss.m(1),
            uri: url
        });
        body = typeof body === "string" ? JSON.parse(body) : body;
        return (remoteVersion = body["dist-tags"].latest);
    } catch (error) {
        return;
    }
};

// 历史版本号
export const hisVersions = glob
    .sync(`@([2-9]|${NGP}).@([0-9]|${NGP}).@([4-9]|${NGP}).spec.[jt]s`, {
        cwd: __dirname,
        dot: true
    })
    .map((v) => {
        return v.replace(/\.spec\.[jt]s/, "");
    })
    .filter((v) => {
        return v === curVersion ? false : true;
    });

const PROJECT_NAME = "aaa";

export const patchBeforeMacro = async (t, vers: string | string[]) => {
    vers = Array.isArray(vers) ? vers : [vers];
    const tmpName =
        `t${Math.ceil(Math.random() * 10000)}-` +
        (vers.length < 5
            ? `${vers.join("-")}`
            : `${vers[0]}--${vers[vers.length - 1]}`);
    const projectPaths = [
        path.resolve(TEST_TEMP_PATH, `${tmpName}`, "now", PROJECT_NAME)
    ];
    process.argv = [process.argv0, ".", "new", projectPaths[0]];
    handler();
    for (const ver of vers) {
        const p = path.resolve(TEST_TEMP_PATH, `${tmpName}`, ver, PROJECT_NAME);
        if (ver === curVersion) {
            await getRemoveVersion();
            if (curVersion === remoteVersion) {
                child_process.execSync(`npx arylo-init@${ver} new ${p}`);
                projectPaths.push(p);
            } else {
                projectPaths.push(projectPaths[0]);
            }
        } else {
            child_process.execSync(`npx arylo-init@${ver} new ${p}`);
            projectPaths.push(p);
        }
    }
    return projectPaths;
};

export const addMacro = (list: string[], config: Config<{ cwd: string }>) => {
    for (const item of list) {
        test(`Check Added File \`${item}\``, (t) => {
            t.true(fs.existsSync(path.resolve(config.get("cwd"), item)));
        });
    }
};

export const removeMacro = (
    list: string[],
    config: Config<{ cwd: string }>
) => {
    for (const item of list) {
        test(`Check Removed File \`${item}\``, (t) => {
            t.false(fs.existsSync(path.resolve(config.get("cwd"), item)));
        });
    }
};
