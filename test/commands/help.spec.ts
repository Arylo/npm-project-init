import test from "ava";
import { handler } from "./../../lib/index";

test("command `-h`", (t) => {
    process.argv = [ process.argv0 , ".", "-h"];
    t.is(true, handler());
});

test("command `--help`", (t) => {
    process.argv = [ process.argv0 , ".", "--help"];
    t.is(true, handler());
});

test("command `help`", (t) => {
    process.argv = [ process.argv0 , ".", "help"];
    t.is(true, handler());
});
