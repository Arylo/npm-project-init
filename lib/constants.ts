import { existsSync, readFileSync } from "fs";
import { basename, resolve } from "path";
import { nameFilter } from "./utils";

/**
 * 模块根地址
 */
export const rootPath = resolve(
    __dirname,
    "..",
    existsSync(`${__dirname}/../../package.json`) ? ".." : ""
);
export const pkg = JSON.parse(
    readFileSync(resolve(rootPath, "package.json"), { encoding: "utf-8" })
);
/**
 * 当前模块版本
 */
export const version = pkg.version;
/**
 * 当前年份
 */
export const year = new Date().getFullYear().toString();

export let projectName = "";
export let targetPath = "";
const resourcesName = "public";
/**
 * 资源文件源位置
 */
export const resourcesRawPath = resolve(rootPath, resourcesName);
/**
 * 资源文件使用位置
 */
export const resourcesPath = resolve(
    rootPath,
    "dist",
    existsSync(`${rootPath}/dist/lib`) ? "lib" : "",
    resourcesName
);

const setProjectName = (path: string) => {
    projectName = nameFilter(path);
    return true;
};

export const setTargetPath = (path: string) => {
    targetPath = path;
    return setProjectName(basename(path));
};

export const FILE_OPTIONS = { encoding: "utf-8" };
