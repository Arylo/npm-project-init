import test from "ava";
import * as fs from "fs";
import * as path from "path";
import { patchBeforeMacro } from "./common";

let TEST_PATH: string;

test.before((t) => {
    const projectPaths = patchBeforeMacro(t, "2.0.5");
    TEST_PATH = projectPaths[1];
});

test("Check New File", (t) => {

    t.is(true, fs.existsSync(path.resolve(TEST_PATH, "test/index.spec.ts")));

    const data = fs.readFileSync(path.resolve(TEST_PATH, "test/index.spec.ts"));
    t.not(0, data.length);
});

test("Check Unexist Files", (t) => {
    t.not(true, fs.existsSync(path.resolve(TEST_PATH, "lib/.gitkeep")));
    t.not(true, fs.existsSync(path.resolve(TEST_PATH, "test/.gitkeep")));
});

test("Check yVersion Parma", (t) => {
    const data = JSON.parse(fs.readFileSync(path.resolve(TEST_PATH, "package.json"), {
        encoding: "utf-8"
    }));
    t.is(data.yVersion, "2.0.5");
});
