import * as fs from "fs";
import ftconfig = require("ftconfig");
import { handler } from "../../lib";
import { getHistoryVersions } from "../../lib/utils/versions";
import test from "../ava";
import { FILE_OPTIONS } from "../common";
import { getFileFunctionMacro, patchesBeforeMacro } from "../utils/macroes";

const versions = ["2.0.4"].concat(getHistoryVersions());

test.serial.before(patchesBeforeMacro, versions);

test.before(getFileFunctionMacro);

for (let i = 0; i < versions.length; i++) {
    const version = versions[i];

    test.serial(`Command \`update\` ${version} => latest`, async (t) => {
        process.argv = [
            process.argv0,
            ".",
            "update",
            t.context.projectPaths[i + 1]
        ];
        t.true(handler());
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    test.serial(`Command \`update\` ${version} => latest Check`, (t) => {
        const getAllFiles = t.context.getAllFiles;
        const getFiles = t.context.getFiles;

        const sourcePath = t.context.projectPaths[0];
        const targetPath = t.context.projectPaths[i + 1];

        t.deepEqual(getAllFiles(sourcePath), getAllFiles(targetPath));
        t.deepEqual(getFiles(sourcePath), getFiles(targetPath));

        for (const name of getFiles(sourcePath)) {
            const sourceFilePath = `${sourcePath}/${name}`;
            const targetFilePath = `${targetPath}/${name}`;

            if (/\.lintstagedrc$/.test(name)) {
                const sourceObject = ftconfig
                    .readFile(sourceFilePath, { type: "json" })
                    .toObject();
                const targetObject = ftconfig
                    .readFile(targetFilePath, { type: "json" })
                    .toObject();
                t.deepEqual(sourceObject, targetObject, `File ${name}`);
            } else if (/\.(ya?ml|json)$/.test(name)) {
                const sourceObject = ftconfig
                    .readFile(sourceFilePath)
                    .toObject();
                const targetObject = ftconfig
                    .readFile(targetFilePath)
                    .toObject();
                t.deepEqual(sourceObject, targetObject, `File ${name}`);
            } else {
                const sourceData = fs
                    .readFileSync(sourceFilePath, FILE_OPTIONS)
                    .trim();
                const targetData = fs
                    .readFileSync(targetFilePath, FILE_OPTIONS)
                    .trim();
                t.is(sourceData.length, targetData.length, `File ${name}`);
                t.is(sourceData, targetData, `File ${name}`);
            }
        }
    });
}
