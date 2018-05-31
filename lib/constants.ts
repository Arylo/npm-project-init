import { basename, resolve } from "path";

export let projectName = "";
export let targetPath = "";
export const resourcesRawPath = resolve(__dirname, "../public");
export const resourcesPath = resolve(__dirname, "public");
export const year = new Date().getFullYear() + "";

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
