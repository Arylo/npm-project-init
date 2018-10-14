import test from "ava";
import * as fs from "fs";
import * as path from "path";
import { handler } from "./../../lib/index";

const TEST_PATH = path.resolve(...[
    __dirname, "../../TEST_PATH",
    `t${Math.ceil(Math.random() * 10000)}`
]);

test("Patch `2.0.5`", async (t) => {
    process.argv = [ process.argv0 , ".", "new", TEST_PATH ];
    handler();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    t.is(true, fs.existsSync(path.resolve(TEST_PATH, "test/index.spec.ts")));
    t.not(true, fs.existsSync(path.resolve(TEST_PATH, "test/.gitkeep")));

    const data = fs.readFileSync(path.resolve(TEST_PATH, "test/index.spec.ts"));
    t.not(0, data.length);
});
