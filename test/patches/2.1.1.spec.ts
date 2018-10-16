import test from "ava";
import * as fs from "fs";
import * as path from "path";
import { patchBeforeMacro } from "./common";

let TEST_PATH: string;

test.before((t) => {
    const projectPaths = patchBeforeMacro(t, "2.1.1");
    TEST_PATH = projectPaths[1];
});

test("Check `package.json`", (t) => {

    const data = JSON.parse(
        fs.readFileSync(path.resolve(TEST_PATH, "package.json"), { encoding: "utf-8"})
    );

    t.is(-1, data.scripts.pretest.indexOf("npm run resource"));
    t.is(-1, data.scripts.pretest.indexOf(" && npm run resource"));
});
