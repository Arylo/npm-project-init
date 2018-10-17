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
        switch (commands.indexOf(command)) {
            case 0:
                t.true(fs.existsSync(path.resolve(TEST_PATH, "node_modules")), command);
                break;
            case 2:
                t.true(fs.readdirSync(path.resolve(TEST_PATH, "dist")).length === 2, command);
                t.true(fs.existsSync(path.resolve(TEST_PATH, "dist/index.js")), command);
                t.true(fs.existsSync(path.resolve(TEST_PATH, "dist/index.js.map")), command);
                break;
            case 3:
                t.false(fs.existsSync(path.resolve(TEST_PATH, "dist")), command);
                break;
            case 4:
                t.true(fs.readdirSync(path.resolve(TEST_PATH, "dist")).length === 1, command);
                t.true(fs.existsSync(path.resolve(TEST_PATH, "dist/index.js")), command);
                t.false(fs.existsSync(path.resolve(TEST_PATH, "dist/index.js.map")), command);
                break;
            case 5:
                t.true(fs.readdirSync(path.resolve(TEST_PATH, "dist")).length === 2, command);
                t.true(fs.existsSync(path.resolve(TEST_PATH, "dist/lib")), command);
                t.true(fs.existsSync(path.resolve(TEST_PATH, "dist/lib/index.js")), command);
                t.true(fs.existsSync(path.resolve(TEST_PATH, "dist/lib/index.js.map")), command);
                t.true(fs.existsSync(path.resolve(TEST_PATH, "dist/test")), command);
                break;
        }
    }

    t.not(true, false);
});
