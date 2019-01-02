import ava, { TestInterface } from "ava";
import { IObj } from "../lib/utils/config";

const test: TestInterface<
    {
        projectPath?: string;
    } & IObj
> = ava;

export default test;
