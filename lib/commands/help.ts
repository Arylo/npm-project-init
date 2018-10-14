import * as fs from "fs";
import * as path from "path";
import * as constants from "../constants";

const commands = fs.readdirSync(__dirname)
    .filter((filename) => /\.js$/.test(filename))
    .map((filename) => filename.replace(/\.js$/, ""));

// tslint:disable-next-line:no-var-requires
export const version = constants.version;

export const handler = () => {
    const binPath = path.resolve(__dirname, "../..", "bin", "arylo-init");
    const $0 = path.basename(binPath);

    process.stdout.write([
        "",
        `Usage: ${$0} <command>`,
        "",
        "where <command> is one of",
        `    ${commands.join(", ")}`,
        "",
        `${$0}@${version} ${binPath}`,
        ""
    ].join("\n"));

    return true;
};
