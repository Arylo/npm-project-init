import ava, { TestInterface } from "ava";
import { modifyHandler } from "../../lib/patches/2.1.24";
import { ILintstagedrc } from "../../lib/types/json";

const test = ava as TestInterface<{ data: ILintstagedrc }>;

test.beforeEach((t) => {
    t.context.data = {
        linters: {
            "./**/*.ts": ["prettier --write --tab-width 4", "npm run lint:typescript -- --fix", "git add"],
            "./**/*.js": ["prettier --write --tab-width 4", "npm run lint:javascript -- --fix", "git add"],
            "./**/*.{json,yaml,yml}": ["prettier --write --tab-width 2", "git add"],
            "./.lintstagedrc": ["prettier --write --tab-width 2 --parser json", "git add"]
        },
        globOptions: {
            dot: true
        }
    };
});

test("[2.1.24]modify lintstagedrc", (t) => {
    const rawData = t.context.data;
    let curData = JSON.parse(JSON.stringify(rawData));
    curData = modifyHandler(curData);
    t.notDeepEqual(rawData, curData);
    t.deepEqual(curData, {
        linters: {
            "./**/*.ts": [
                "prettier --config _scripts/.prettierrc.yml --write --tab-width 4",
                "npm run lint:typescript -- --fix",
                "git add"
            ],
            "./**/*.js": [
                "prettier --config _scripts/.prettierrc.yml --write --tab-width 4",
                "npm run lint:javascript -- --fix",
                "git add"
            ],
            "./**/*.{json,yaml,yml}": ["prettier --config _scripts/.prettierrc.yml --write --tab-width 2", "git add"],
            "./.lintstagedrc": [
                "prettier --config _scripts/.prettierrc.yml --write --tab-width 2 --parser json",
                "git add"
            ]
        },
        globOptions: {
            dot: true
        }
    });
});
