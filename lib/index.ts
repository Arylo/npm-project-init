import fs = require("fs");
import mkdirp = require("mkdirp");
import path = require("path");
import constants = require("./constants");

// tslint:disable-next-line:no-var-requires
const json = require("./public/tree.json");

const exit = (msg: string | string[], code = 1) => {
    if (Array.isArray(msg)) {
        // tslint:disable-next-line:no-console
        console.log(...msg);
    } else {
        // tslint:disable-next-line:no-console
        console.log(msg);
    }
    process.exit(1);
};

const moveFiles = (p: string, filepaths: string[], cb?) => {
    const targetPath = constants.targetPath;
    const resourcesPath = constants.resourcesPath;
    const projectName = constants.projectName;
    const year = constants.year;

    mkdirp(path.resolve(targetPath, p), (err) => {
        if (err) {
            throw err;
        }
        const paths = filepaths.filter((item) => {
            return new RegExp(`^${p}/[^/]+$`).test(item);
        });
        paths.forEach((item) => {
            const to = path.resolve(targetPath, item);
            if (!json.files[item]) {
                moveFiles(item, filepaths);
            } else {
                const from = path.resolve(resourcesPath, json.files[item]);
                fs.createReadStream(from)
                    .pipe(fs.createWriteStream(to)
                        .on("close", () => {
                            const data = fs
                                .readFileSync(to, { encoding: "utf-8" })
                                .replace(/<year>/g, year)
                                .replace(/<project_name>/g, projectName);
                            fs.writeFileSync(to, data, { encoding: "utf-8" });
                        })
                    );
            }
        });
    });
    if (cb && typeof cb === "function") {
        setTimeout(() => cb(), 50);
    }
};

(() => {
    let folderPath = process.argv[2];
    if (!folderPath) {
        exit("Invaild Path");
    }
    if (!path.isAbsolute(folderPath)) {
        folderPath = path.resolve(process.cwd(), folderPath);
        if (!path.isAbsolute(folderPath)) {
            exit("Invaild Path");
        }
    }
    if (fs.existsSync(folderPath)) {
        exit("Folder Exist");
    }

    constants.setTargerPath(folderPath);

    const filepaths = json.list;
    moveFiles(".", filepaths, () => {
        require("child_process").exec(`git init -q ${folderPath}`);
    });
})();
