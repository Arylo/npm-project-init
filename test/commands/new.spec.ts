import test from "ava";
import * as fs from "fs";
import * as path from "path";
import json = require("../../lib/data");
import { FILE_OPTIONS, TEST_TEMP_PATH } from "../common";
import { handler } from "./../../lib/index";

const TEST_PATH = path.resolve(...[
    TEST_TEMP_PATH,
    `t${Math.ceil(Math.random() * 10000)}`
]);

test("command `new`", async (t) => {
    process.argv = [ process.argv0 , ".", "new", TEST_PATH ];
    t.is(true, handler());
    await new Promise((resolve) => setTimeout(resolve, 1000));
    t.is(true, fs.existsSync(path.resolve(TEST_PATH, ".git")));
    json.list.forEach((p) => {
        t.is(true, fs.existsSync(path.resolve(TEST_PATH, p)));
    });
    Object.keys(json.files).forEach((p) => {
        const filePath = path.resolve(TEST_PATH, p);
        const data = fs.readFileSync(filePath, FILE_OPTIONS);
        [ "<year>", "<project_name>", "<version>" ].forEach((item) => {
            t.is(-1, data.indexOf(item));
        });
    });
});
