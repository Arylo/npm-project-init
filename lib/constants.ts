import { basename, resolve } from "path";
import { nameFilter } from "./utils";

// tslint:disable-next-line:no-var-requires
export const pkg = require("../package.json");
/**
 * 模块根地址
 */
export const rootPath = resolve(__dirname, "..");
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
export const resourcesPath = resolve(__dirname, resourcesName);

const setProjectName = (path: string) => {
    projectName = nameFilter(path);
    return true;
};

export const setTargetPath = (path: string) => {
    targetPath = path;
    return setProjectName(basename(path));
};
