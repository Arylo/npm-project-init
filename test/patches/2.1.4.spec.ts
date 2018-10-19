import test from "ava";
import * as fs from "fs";
import * as path from "path";
import * as json from "../../lib/utils/json";
import { patchBeforeMacro } from "./common";

let TEST_PATH: string;

test.before(t => {
    const projectPaths = patchBeforeMacro(t, "2.1.4");
    TEST_PATH = projectPaths[1];
});

test("Check `package.json`", t => {
    const data = json.read(path.resolve(TEST_PATH, "package.json"));

    t.is("^1.1.2", data.devDependencies.husky);
    t.is("^7.3.0", data.devDependencies["lint-staged"]);
    t.is("^1.14.3", data.devDependencies.prettier);
    t.not(-1, data.keywords.indexOf("typescript"));
});

test("Chcek `.lintstagedrc`", t => {
    t.true(fs.existsSync(path.resolve(TEST_PATH, ".lintstagedrc")));
});

test("Chcek `.huskyrc.json`", t => {
    t.true(fs.existsSync(path.resolve(TEST_PATH, ".huskyrc.json")));
});
