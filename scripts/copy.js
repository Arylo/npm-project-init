const glob = require("glob");
const fs = require("fs");
const mkdirp = require("mkdirp");
const md5 = require("md5");
const { resourcesRawPath } = require("../dist/constants");

const distPath = `${__dirname}/../dist/public`;

(() => {
    const filepaths = glob.sync("./**", {
        cwd: resourcesRawPath,
        dot: true
    });
    mkdirp(distPath, (err) => {
        if (err) {
            return;
        }
        const json = {
            list: filepaths,
            files: { }
        };
        for (const filepath of filepaths) {
            const p = `${resourcesRawPath}/${filepath}`;
            const stat = fs.statSync(p);
            if (stat.isFile()) {
                const md5sum = md5(filepath);
                json.files[filepath] = md5sum;
                fs.createReadStream(p)
                    .pipe(fs.createWriteStream(`${distPath}/${md5sum}`))
            }
        }
        fs.writeFileSync(
            `${distPath}/tree.json`,
            JSON.stringify(json),
            { encoding: 'utf-8' }
        );
    });
})();
