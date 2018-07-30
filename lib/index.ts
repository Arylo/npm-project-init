import updateNotifier = require("update-notifier");

(() => {
    updateNotifier({
        pkg: require("../package.json"),
        updateCheckInterval: 1000 * 60 * 60 * 24 * 7
    }).notify();
    if (process.argv.indexOf("-v") !== -1) {
        const version = require("./commands/help").version;
        process.stdout.write(`v${version}`);
        return;
    }
    if (process.argv.indexOf("-h") !== -1) {
        return require("./commands/help").handler();
    }
    const command = process.argv[2];
    switch (command) {
        case "new":
            return require("./commands/new").handler();
        case "help":
        default:
            return require("./commands/help").handler();
    }
})();
