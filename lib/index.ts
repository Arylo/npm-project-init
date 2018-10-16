import updateNotifier = require("update-notifier");
import * as constants from "./constants";
import { getCommand } from "./utils";

export const handler = () => {
    const ARGV = process.argv;

    updateNotifier({
        pkg: constants.pkg,
        updateCheckInterval: 1000 * 60 * 60 * 24 * 7
    }).notify();
    if (ARGV.indexOf("-v") !== -1 || ARGV.indexOf("--version") !== -1) {
        const version = constants.version;
        process.stdout.write(`v${version}\n`);
        return true;
    }
    if (ARGV.indexOf("-h") !== -1 || ARGV.indexOf("--help") !== -1) {
        return getCommand("help").handler();
    }
    const command = ARGV[2];
    switch (command) {
        case "new":
            return getCommand("new").handler();
        case "update":
            return getCommand("update").handler();
        case "help":
        default:
            return getCommand("help").handler();
    }
};
