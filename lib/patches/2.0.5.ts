import * as fs from "fs";
import * as path from "path";
import * as rimraf from "rimraf";
import constants = require("../constants");
import data = require("../data");

export const ADD_LIST = ["test/index.spec.ts"];
export const UPDATE_LIST = ["package.json"];
export const REMOVE_LIST = ["lib/.gitkeep" , "test/.gitkeep"];

const FILE_OPTIONS = {
    encoding: "utf-8"
};

export const add = (filePoint: string) => {
    if (ADD_LIST.indexOf(filePoint) === -1) {
        return;
    }
    const rawFileName = data.files["./" + filePoint];
    const from =  path.resolve(constants.resourcesPath, rawFileName);
    const to =  path.resolve(constants.targetPath, filePoint);
    fs.createReadStream(from).pipe(fs.createWriteStream(to));
};

export const update = (filePoint: string) => {
    if (UPDATE_LIST.indexOf(filePoint) === -1) {
        return;
    }
    const filePath = path.resolve(constants.targetPath, filePoint);
    const json = JSON.parse(fs.readFileSync(filePath, FILE_OPTIONS));

    json.scripts["build:prod"] = "npm run tsc -- -P tsconfig.prod.json",
    json.scripts["build:test"] = "npm run tsc -- -P tsconfig.test.json",
    json.scripts.pretest = "npm run clean && npm run build:test && npm run resource",
    json.devDependencies.typescript = "^2.9.2";

    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), FILE_OPTIONS);
};

export const remove = (filePoint: string) => {
    if (REMOVE_LIST.indexOf(filePoint) === -1) {
        return;
    }
    const filePath = path.resolve(constants.targetPath, filePoint);
    rimraf.sync(filePath);
};
