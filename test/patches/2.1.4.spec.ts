import test from "ava";
import * as path from "path";
import Config = require("y-config");
import { Pkg } from "../../lib/utils/pkg";
import { getVersionObj } from "../../lib/utils/versions";
import { addMacro, patchBeforeMacro } from "./common";

const config = new Config<{ cwd: string }>();
const VERSION = path.basename(__filename).replace(/^(\d+\.\d+\.\d+).*/, "$1");
let TEST_PATH: string;

test.before(async (t) => {
    const projectPaths = await patchBeforeMacro(t, VERSION);
    TEST_PATH = projectPaths[1];
    config.addConfig({ cwd: TEST_PATH });
});

test("Check `package.json`", (t) => {
    const data = new Pkg(TEST_PATH).toObject();

    t.is("^1.1.2", data.devDependencies.husky);
    t.is("^7.3.0", data.devDependencies["lint-staged"]);
    t.is("^1.14.3", data.devDependencies.prettier);
    t.not(-1, data.keywords.indexOf("typescript"));
});

addMacro(getVersionObj(VERSION).ADD_LIST, config);
