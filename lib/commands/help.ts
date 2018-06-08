import * as path from "path";

const commands = ["new", "help"];

// tslint:disable-next-line:no-var-requires
export const version = require(`${__dirname}/../../package.json`).version;

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
};
