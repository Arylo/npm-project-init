import test from "ava";
import { handler } from "./../../lib/index";

test("command `-v`", (t) => {
    process.argv = [ process.argv0 , ".", "-v"];
    t.is(true, handler());
});

test("command `--version`", (t) => {
    process.argv = [ process.argv0 , ".", "--version"];
    t.is(true, handler());
});
