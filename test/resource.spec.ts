import test from "ava";
import child_process = require("child_process");
import * as fs from "fs";
import * as path from "path";
import { handler } from "./../lib/index";
import { TEST_TEMP_PATH } from "./common";

const TEST_PATH = path.resolve(...[
    TEST_TEMP_PATH,
    `t${Math.ceil(Math.random() * 10000)}`
]);

test.before(async () => {
    process.argv = [ process.argv0 , ".", "new", TEST_PATH ];
    handler();

    await new Promise((resolve) => setTimeout(resolve, 1000));
});

test("Resource Run", async (t) => {

    const commands = [
        "npm install --no-package-lock",
        "npm run lint",
        "npm run build",
        "npm run clean",
        "npm run build:prod",
        "npm run test",
    ];

    for (const command of commands) {
        child_process.execSync(command, { cwd: TEST_PATH }).toString();
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const existsFilesList: string[] = [ ];
        const unexistsFilesList: string[] = [ ];

        switch (commands.indexOf(command)) {
            case 0:
                t.true(fs.existsSync(path.resolve(TEST_PATH, "node_modules")), command);
                break;
            case 2:
                t.true(fs.readdirSync(path.resolve(TEST_PATH, "dist")).length === 4, command);
                existsFilesList.push("dist/index.js", "dist/index.js.map");
                // Since 2.1.3
                patch2d1d3Check(t, TEST_PATH, command);
                break;
            case 3:
                t.false(fs.existsSync(path.resolve(TEST_PATH, "dist")), command);
                break;
            case 4:
                t.true(fs.readdirSync(path.resolve(TEST_PATH, "dist")).length === 3, command);
                existsFilesList.push("dist/index.js");
                unexistsFilesList.push("dist/index.js.map");
                // Since 2.1.3
                patch2d1d3Check(t, TEST_PATH, command);
                break;
            case 5:
                t.true(fs.readdirSync(path.resolve(TEST_PATH, "dist")).length === 2, command);
                existsFilesList.push("dist/lib", "dist/lib/index.js", "dist/lib/index.js.map", "dist/test");
                // Since 2.1.3
                patch2d1d3Check(t, TEST_PATH, command);
                break;
        }
        for (const item of existsFilesList) {
            t.true(fs.existsSync(path.resolve(TEST_PATH, item)), `${command}[File \`${item}\`]`);
        }
        for (const item of unexistsFilesList) {
            t.false(fs.existsSync(path.resolve(TEST_PATH, item)), `${command}[File \`${item}\`]`);
        }
    }
});

const patch2d1d3Check = (t, p: string, command: string) => {
    p = path.resolve(p, "dist");
    if (fs.existsSync(path.resolve(p, "lib"))) {
        p = path.resolve(p, "lib");
    }
    for (const item of ["index.d.ts", "index.d.ts.map"]) {
        t.true(fs.existsSync(path.resolve(p, item)), command);
    }
};
