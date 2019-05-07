const glob = require("glob");
const fs = require("fs");
const path = require("path");
const mkdirp = require("make-dir");
const md5 = require("md5");

const resourcesRawPath = path.resolve(__dirname, "../public");

const distPath = path.resolve(
    ...[
        __dirname,
        "../dist/public",
        fs.existsSync(path.resolve(__dirname, "../dist/lib"))
            ? "../lib/public"
            : ""
    ]
);

(() => {
    const filePaths = glob.sync("./**", {
        cwd: resourcesRawPath,
        dot: true
    });
    mkdirp.sync(distPath);
    const json = {
        list: filePaths,
        files: {}
    };
    for (const filePath of filePaths) {
        const p = path.resolve(resourcesRawPath, filePath);
        const stat = fs.statSync(p);
        if (stat.isFile()) {
            const md5sum = md5(filePath);
            const newFilePath = path.resolve(distPath, md5sum);
            json.files[filePath] = md5sum;
            fs.createReadStream(p).pipe(fs.createWriteStream(newFilePath));
        }
    }
    fs.writeFileSync(
        path.resolve(distPath, "tree.json"),
        JSON.stringify(json),
        { encoding: "utf-8" }
    );
})();
