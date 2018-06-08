import { basename, resolve } from "path";

export let projectName = "";
export let targetPath = "";
const resourcesName = "public";
export const resourcesRawPath = resolve(__dirname, "..", resourcesName);
export const resourcesPath = resolve(__dirname, resourcesName);
export const year = new Date().getFullYear().toString();

const setProjectName = (path: string) => {
    projectName = path
        .toLowerCase()
        .replace(/^[^a-f]*/i, "")
        .replace(/\W/g, "");
    return true;
};

export const setTargerPath = (path: string) => {
    targetPath = path;
    return setProjectName(basename(path));
};
