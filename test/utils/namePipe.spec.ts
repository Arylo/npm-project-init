import test from "ava";
import { namePipe as fn } from "./../../lib/utils";

let index = 0;

test(`name #${index++}`, (t) => {
    t.is(fn("arylo-init"), "arylo-init");
});

test(`name #${index++}`, (t) => {
    t.is(fn("1tst"), "tst");
});

test(`name #${index++}`, (t) => {
    t.is(fn("get_some"), "get_some");
});
