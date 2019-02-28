import child_process = require("child_process");
import ftconfig = require("ftconfig");
import * as path from "path";
import test from "../ava";
import { patchBeforeMacro } from "./common";

test.before("Init Env", async (t) => {
    const projectPaths = await patchBeforeMacro(t, "2.1.19");
    t.context.projectPath = projectPaths[1];
});

test("lint pass", (t) => {
    ftconfig
        .readFile(path.resolve(t.context.projectPath, "lib/index.ts"))
        .modify((str) => {
            str += `\nconst obj = {\n    foo: true,\n    bar: false\n};\n`;
            return str;
        })
        .save();

    t.notThrows(() =>
        child_process.execSync("npm install", { cwd: t.context.projectPath })
    );
    t.notThrows(() =>
        child_process.execSync("npm run lint:typescript", {
            cwd: t.context.projectPath
        })
    );
});
