import test from "ava";
import * as path from "path";
import Config = require("y-config");
import { Pkg } from "../../lib/utils/pkg";
import { patchBeforeMacro } from "./common";

let p: string;

test.before(async (t) => {
    const projectPaths = await patchBeforeMacro(t, "2.0.4");
    p = projectPaths[1];
});

// tslint:disable:no-bitwise
test("tsconfig.test.json File Diff Check", (t) => {
    const obj = require(path.resolve(p, "tsconfig.test.json"));
    t.true(!!~obj.include.indexOf("./lib/**/*"));
    t.false(!!~obj.include.indexOf("./src/**/*"));
});

test(".travis File Diff Check", (t) => {
    const config = new Config();
    config.addConfigPath(path.resolve(p, ".travis.yml"));
    const obj = config.toObject() as any;
    t.is(obj.deploy.email, "arylo.open+npm@gmail.com");
    t.not(obj.deploy.email, "arylo.open@gmail.com");
});

test("package.json File Diff Check", (t) => {
    const obj = new Pkg(p).toObject();
    t.truthy(obj.yVersion);
});
