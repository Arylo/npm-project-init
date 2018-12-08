import test from "ava";
import * as path from "path";
import { Json } from "../../lib/utils/json";
import { IPackage } from "../../lib/utils/json.d";
import { patchBeforeMacro } from "./common";

let TEST_PATH: string;

test.before(async (t) => {
    const projectPaths = await patchBeforeMacro(t, "2.1.3");
    TEST_PATH = projectPaths[1];
});

test("Check `package.json`", (t) => {
    const data = new Json<IPackage>(
        path.resolve(TEST_PATH, "package.json")
    ).toObject();

    t.is("^3.1.3", data.devDependencies.typescript);
});

test("Check `tsconfig.json`", (t) => {
    const data = new Json(path.resolve(TEST_PATH, "tsconfig.json")).toObject();

    t.true(data.compilerOptions.declaration);
    t.true(data.compilerOptions.declarationMap);
});
