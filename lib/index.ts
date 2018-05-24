import fs = require("fs");
import mkdirp = require("mkdirp");
import glob = require("glob");
import path = require("path");
import constants = require("./constants");

const exit = (msg: string | string[], code = 1) => {
    if (Array.isArray(msg)) {
        console.log(...msg);
    } else {
        console.log(msg)
    }
    process.exit(1);
};

const moveFiles = (p: string, filepaths: string[], cb?) => {
    const targetPath = constants.targetPath;
    const resourcesPath = constants.resourcesPath;
    const projectName = constants.projectName;
    const year = constants.year;

    mkdirp(`${targetPath}/${p}`, (err) => {
        if (err) {
            throw err;
        }
        const paths = filepaths.filter((item) => {
            return new RegExp(`^${p}/[^/]+$`).test(item);
        });
        paths.forEach((item) => {
            const from = `${resourcesPath}/${item}`;
            const to = `${targetPath}/${item}`;
            const stat = fs.statSync(from);
            if (stat.isDirectory()) {
                moveFiles(item, filepaths);
            } else if (stat.isFile()) {
                fs.createReadStream(from)
                    .pipe(fs.createWriteStream(to)
                        .on('close', () => {
                            const data = fs
                                .readFileSync(to, { encoding: 'utf-8' })
                                .replace(/<year>/g, year)
                                .replace(/<project_name>/g, projectName);
                            fs.writeFileSync(to, data, { encoding: 'utf-8' });
                        })
                    );
            }
        });
    });
    if (cb && typeof cb === 'function') {
        setTimeout(() => cb(), 50);
    }
};

(() => {
    let folderPath = process.argv[2];
    if (!folderPath) {
        exit("Invaild Path");
    }
    if (!path.isAbsolute(folderPath)) {
        folderPath = `${process.cwd()}/${folderPath}`;
        if (!path.isAbsolute(folderPath)) {
            exit("Invaild Path");
        }
    }
    if (fs.existsSync(folderPath)) {
        exit("Folder Exist");
    }

    constants.setTargerPath(folderPath);

    const filepaths = glob.sync("./**", {
        dot: true, cwd: constants.resourcesPath
    });
    moveFiles('.', filepaths, () => {
        require('child_process').exec(`git init -q ${folderPath}`);
    });
})()
