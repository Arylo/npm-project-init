import * as fs from "fs";
import { FILE_OPTIONS } from "../constants";

export const read = (p: fs.PathLike) => {
    const filePath = p;
    if (!fs.existsSync(filePath)) {
        return null;
    }
    try {
        return JSON.parse(fs.readFileSync(filePath, FILE_OPTIONS));
    } catch (error) {
        return null;
    }
};

export const write = (p: fs.PathLike, data: object) => {
    fs.writeFileSync(p, JSON.stringify(data, null, 2), FILE_OPTIONS);
};
