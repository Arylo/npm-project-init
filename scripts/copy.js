const glob = require('glob');
const fs = require('fs');
const path = require('path');
const mkdirp = require('make-dir');
const md5 = require('md5');
const { resourcesRawPath } = require('../dist/constants');

const distPath = path.resolve(__dirname, '../dist/public');

(() => {
    const filepaths = glob.sync('./**', {
        cwd: resourcesRawPath,
        dot: true
    });
    mkdirp.sync(distPath);
    const json = {
        list: filepaths,
        files: { }
    };
    for (const filepath of filepaths) {
        const p = path.resolve(resourcesRawPath, filepath);
        const stat = fs.statSync(p);
        if (stat.isFile()) {
            const md5sum = md5(filepath);
            const newFilepath = path.resolve(distPath, md5sum);
            json.files[filepath] = md5sum;
            fs.createReadStream(p).pipe(fs.createWriteStream(newFilepath));
        }
    }
    fs.writeFileSync(
        path.resolve(distPath, 'tree.json'),
        JSON.stringify(json),
        { encoding: 'utf-8' }
    );
})();
