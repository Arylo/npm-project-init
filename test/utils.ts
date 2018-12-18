import * as fs from "fs";
import ftconfig = require("ftconfig");
import * as path from "path";

export const getPkg = (p: fs.PathLike) => {
    const filePath = path.resolve(p.toString(), "package.json");
    return ftconfig.readFile(filePath);
};
