import ava, { TestInterface } from "ava";
import * as fs from "fs";
import { IObj } from "../lib/types/config";

const test: TestInterface<
    {
        projectPath?: string;
        projectPaths?: string[];
        getAllFiles(p: fs.PathLike): string[];
        getFiles(p: fs.PathLike): string[];
    } & IObj
> = ava;

export default test;
