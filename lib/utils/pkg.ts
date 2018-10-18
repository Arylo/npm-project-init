import * as fs from "fs";
import * as path from "path";
import * as json from "./json";

export const read = (p: fs.PathLike) => {
    const filePath = path.resolve(p.toString(), "package.json");
    return json.read(filePath);
};

export const write = (p: fs.PathLike, data: object) => {
    const filePath = path.resolve(p.toString(), "package.json");
    return json.write(filePath, data);
};
