import child_process = require("child_process");
import fs = require("fs");
import glob = require("glob");
import path = require("path");
import { handler } from "../../lib";
import { sortFn } from "../../lib/utils/versions";
import { TEST_TEMP_PATH } from "../common";
import { curVersion, getRemoveVersion, remoteVersion } from "../patches/common";

const PROJECT_NAME = "aaa";

export async function patchesBeforeMacro(t, vers: string | string[]) {
    vers = Array.isArray(vers) ? vers : [vers];
    vers = vers.sort(sortFn());
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    t.context.projectPaths = projectPaths;
}

patchesBeforeMacro.title = (providedTitle, vers) => {
    vers = Array.isArray(vers) ? vers : [vers];
    return ["Get"].concat(vers).join(" ");
};

export function getFileFunctionMacro(t) {
    const filesMap = {
        allFiles: {},
        files: {}
    };

    t.context.getAllFiles = (p: fs.PathLike): string[] => {
        filesMap.allFiles[p.toString()] = glob.sync("./!(.git){,/**}", {
            cwd: t.context.projectPaths[0],
            dot: true
        });
        return filesMap.allFiles[p.toString()];
    };

    t.context.getFiles = (p: fs.PathLike): string[] => {
        filesMap.files[p.toString()] = t.context
            .getAllFiles(p)
            .filter((name) => fs.statSync(`${p}/${name}`).isFile());
        return filesMap.files[p.toString()];
    };
}
