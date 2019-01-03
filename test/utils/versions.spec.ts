import {
    filterFn,
    getHistoryVersions,
    parseVersion,
    sortFn
} from "../../lib/utils/versions";
import test from "../ava";

test.beforeEach((t) => {
    t.context.versionList = [
        "10.30.6",
        "1.0.0",
        "0.0.0",
        "3.10.9",
        "2.0.1",
        "3.1.10",
        "3.10.11"
    ];
});

test("Parse Version toString", (t) => {
    t.is(parseVersion("10.9.3").toString(), "10.9.3");
});

test("Sort Function #1", (t) => {
    const list = t.context.versionList
        .map(parseVersion)
        .sort(sortFn())
        .map((v) => v.toString());

    t.deepEqual(list, [
        "0.0.0",
        "1.0.0",
        "2.0.1",
        "3.1.10",
        "3.10.9",
        "3.10.11",
        "10.30.6"
    ]);
});

test("Sort Function #2", (t) => {
    const list = t.context.versionList
        .map(parseVersion)
        .sort(sortFn(false))
        .map((v) => v.toString());

    t.deepEqual(
        list,
        [
            "0.0.0",
            "1.0.0",
            "2.0.1",
            "3.1.10",
            "3.10.9",
            "3.10.11",
            "10.30.6"
        ].reverse()
    );
});

test("Filter Function #1", (t) => {
    const list = t.context.versionList
        .map(parseVersion)
        .filter(filterFn(parseVersion("10.0.0")))
        .map((v) => v.toString());

    t.deepEqual(list, ["10.30.6"]);
});

test("Filter Function #2", (t) => {
    const list = t.context.versionList
        .map(parseVersion)
        .filter(filterFn(parseVersion("3.1.10")))
        .map((v) => v.toString());

    t.deepEqual(list, ["10.30.6", "3.10.9", "3.10.11"]);
});

test("Get History Versions", (t) => {
    t.true(Array.isArray(getHistoryVersions()));
});
