import * as path from "path";
import * as rimraf from "rimraf";
import test from "../ava";
import { handler } from "./../../lib/index";
import { patchBeforeMacro } from "./common";

test.before("Init Env", async (t) => {
    const projectPaths = await patchBeforeMacro(t, "2.1.14");
    t.context.projectPath = projectPaths[1];

    rimraf.sync(path.resolve(t.context.projectPath, "test/index.spec.ts"));
});

test("is no fail", (t) => {
    process.argv = [process.argv0, ".", "update", t.context.projectPath];
    t.is(true, handler());
});
