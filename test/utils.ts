import * as fs from "fs";
import * as path from "path";
import { FILE_OPTIONS } from "./common";

export const getPkg = (p: fs.PathLike) => {
    const filePath = path.resolve(p.toString(), "package.json");
    if (!fs.existsSync(filePath)) {
        return null;
    }
    try {
        return JSON.parse(fs.readFileSync(filePath, FILE_OPTIONS));
    } catch (error) {
        return null;
    }
};
