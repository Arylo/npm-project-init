import test from "ava";
import * as fs from "fs";
import * as glob from "glob";
import { handler } from "../../lib";
import { hisVersions } from "../../lib/patches/index";
import { FILE_OPTIONS } from "../common";
import { patchBeforeMacro } from "../patches/common";
import { diffObject } from "./common";

let projectPaths: string[];
const versions = ["2.0.4"].concat(hisVersions);

const filesMap = {
    allFiles: { },
    files: { },
};

const getAllFiles = (p: fs.PathLike): string[] => {
    filesMap.allFiles[p.toString()] =
        glob.sync("./!(.git){,/**}", { cwd: projectPaths[0], dot: true });
    return filesMap.allFiles[p.toString()];
};
const getFiles = (p: fs.PathLike): string[] => {
    filesMap.files[p.toString()] = getAllFiles(p)
        .filter((name) => fs.statSync(`${p}/${name}`).isFile());
    return filesMap.files[p.toString()];
};

test.before(async (t) => {
    projectPaths = patchBeforeMacro(t, versions);
    for (const projectPath of projectPaths) {
        process.argv = [ process.argv0 , ".", "update", projectPath ];
        handler();
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
});

for (let i = 0; i < versions.length; i++) {
    const version = versions[i];

    test(`Command \`update\` ${version} => latest`, (t) => {
        const sourcePath = projectPaths[0];
        const targetPath = projectPaths[i + 1];

        diffObject(t, getAllFiles(sourcePath), getAllFiles(targetPath));
        diffObject(t, getFiles(sourcePath), getFiles(targetPath));

        for (const name of getFiles(sourcePath)) {
            const sourceData = fs.readFileSync(`${sourcePath}/${name}`, FILE_OPTIONS).trim();
            const targetData = fs.readFileSync(`${targetPath}/${name}`, FILE_OPTIONS).trim();

            if (/\.json$/.test(name)) {
                const sourceObject = JSON.parse(sourceData);
                const targetObject = JSON.parse(targetData);
                diffObject(t, sourceObject, targetObject, `File ${name}`);
            } else {
                t.is(sourceData.length, targetData.length, `File ${name}`);
                t.is(sourceData, targetData, `File ${name}`);
            }
        }
    });
}
