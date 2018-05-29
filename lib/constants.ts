import { basename } from "path";

export let projectName = "";
export let targetPath = "";
export const resourcesRawPath = `${__dirname}/../public`;
export const resourcesPath = `${__dirname}/public`;
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
    setProjectName(basename(path));
    return true;
};
