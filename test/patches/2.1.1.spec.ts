import test from "ava";
import { getPkg } from "../utils";
import { patchBeforeMacro } from "./common";

let TEST_PATH: string;

test.before(async (t) => {
    const projectPaths = await patchBeforeMacro(t, "2.1.1");
    TEST_PATH = projectPaths[1];
});

test("Check `package.json`", (t) => {
    const data = getPkg(TEST_PATH);

    t.is(-1, data.scripts.pretest.indexOf("npm run resource"));
    t.is(-1, data.scripts.pretest.indexOf(" && npm run resource"));
});
