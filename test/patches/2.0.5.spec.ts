import test from "ava";
import * as fs from "fs";
import * as path from "path";
import { Pkg } from "../../lib/utils/pkg";
import { patchBeforeMacro } from "./common";

let TEST_PATH: string;

test.before(async (t) => {
    const projectPaths = await patchBeforeMacro(t, "2.0.5");
    TEST_PATH = projectPaths[1];
});

test("Check New File", (t) => {
    t.true(fs.existsSync(path.resolve(TEST_PATH, "test/index.spec.ts")));

    const data = fs.readFileSync(path.resolve(TEST_PATH, "test/index.spec.ts"));
    t.not(0, data.length);
});

test("Check Unexist Files", (t) => {
    t.false(fs.existsSync(path.resolve(TEST_PATH, "lib/.gitkeep")));
    t.false(fs.existsSync(path.resolve(TEST_PATH, "test/.gitkeep")));
});

test("Check yVersion Parma", (t) => {
    const data = new Pkg(TEST_PATH).toObject();
    t.is(data.yVersion, "2.0.5");
});
