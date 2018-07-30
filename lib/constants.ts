import { basename, resolve } from "path";
import { nameFilter } from "./utils";

export let projectName = "";
export let targetPath = "";
const resourcesName = "public";
export const resourcesRawPath = resolve(__dirname, "..", resourcesName);
export const resourcesPath = resolve(__dirname, resourcesName);
export const year = new Date().getFullYear().toString();
// tslint:disable-next-line:no-var-requires
export const version = require("../package.json").version;

const setProjectName = (path: string) => {
    projectName = nameFilter(path);
    return true;
};

export const setTargerPath = (path: string) => {
    targetPath = path;
    return setProjectName(basename(path));
};
