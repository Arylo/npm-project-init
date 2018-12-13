import test from "ava";
import child_process = require("child_process");
import * as fs from "fs";
import * as path from "path";
import { handler } from "./../lib/index";
import { TEST_TEMP_PATH } from "./common";

const TEST_PATH = path.resolve(
    ...[TEST_TEMP_PATH, `t${Math.ceil(Math.random() * 10000)}`]
);

test.before(async () => {
    process.argv = [process.argv0, ".", "new", TEST_PATH];
    handler();

    await new Promise((resolve) => setTimeout(resolve, 1000));
});

const commands = [
    "npm install --no-package-lock",
    // Because the eslint match no files
    // "npm run lint",
    "npm run lint:typescript",
    "npm run build",
    "npm run clean",
    "npm run build:prod",
    "npm run test"
];

for (const command of commands) {
    test.serial(`Resource Run \`${command}\'`, async (t) => {
        child_process.execSync(command, { cwd: TEST_PATH }).toString();
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const existsFilesList: string[] = [];
        const unexistsFilesList: string[] = [];

        switch (commands.indexOf(command) + 1) {
            case 1:
                existsFilesList.push("node_modules");
                break;
            case 3:
                existsFilesList.push(
                    "dist/lib/index.js",
                    "dist/lib/index.js.map",
                    // Since 2.1.3
                    "dist/lib/index.d.ts",
                    "dist/lib/index.d.ts.map"
                );
                break;
            case 4:
                unexistsFilesList.push("dist");
                break;
            case 5:
                existsFilesList.push(
                    "dist/index.js",
                    // Since 2.1.3
                    "dist/index.d.ts"
                    // "dist/index.d.ts.map"
                );
                unexistsFilesList.push(
                    "dist/index.js.map",
                    // When 2.1.5
                    "dist/index.d.ts.map"
                );
                break;
            case 6:
                existsFilesList.push(
                    "dist/lib",
                    "dist/lib/index.js",
                    "dist/lib/index.js.map",
                    "dist/test",
                    // Since 2.1.3
                    "dist/lib/index.d.ts",
                    "dist/lib/index.d.ts.map"
                );
                break;
            default:
                t.not(true, false);
                break;
        }
        for (const item of existsFilesList) {
            t.true(
                fs.existsSync(path.resolve(TEST_PATH, item)),
                `${command}[File \`${item}\`]`
            );
        }
        for (const item of unexistsFilesList) {
            t.false(
                fs.existsSync(path.resolve(TEST_PATH, item)),
                `${command}[File \`${item}\`]`
            );
        }
    });
}
