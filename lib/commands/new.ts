import fs = require("fs");
import constants = require("../constants");
import { dealPath, exit } from "../utils";
import * as out from "./../utils/out";

import { moveFiles } from "../utils/resources";

export const handler = () => {
    const folderPath = dealPath(process.argv[3]);

    if (fs.existsSync(folderPath)) {
        exit("Folder Exist");
    }

    constants.setTargetPath(folderPath);

    moveFiles(constants.targetPath, () => {
        out.pipe("CREATE", "./.git");
        require("child_process").exec(`git init -q ${folderPath}`);
        out.pipe("\n  Path:", constants.targetPath);
    });

    return true;
};
