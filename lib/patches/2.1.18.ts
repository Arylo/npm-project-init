import * as ftconfig from "ftconfig";
import * as path from "path";
import constants = require("../constants");
import { ITravis } from "../types/yaml";

export const UPDATE_LIST = [".travis.yml"];

export const update = (filePoint: string) => {
    const filePath = path.resolve(constants.targetPath, filePoint);

    ftconfig
        .readFile<ITravis>(filePath)
        .modify((obj) => {
            obj.os = ["linux", "osx"];
            obj.node_js = obj.node_js.filter((val) => {
                return val !== "6" && val !== "node";
            });
            obj.before_script = ["npm install"].concat(obj.before_script || []);
            obj.before_deploy = obj.before_deploy.map((val) => {
                if (val === "npm run build -- -P ./tsconfig.prod.json") {
                    val = "npm run build:prod";
                }
                return val;
            });
            obj.stages = ["lint", "test", "deploy"];
            try {
                delete obj.deploy.on.node_js;
                // tslint:disable-next-line:no-empty
            } catch (e) {}
            obj.jobs = {
                include: [
                    {
                        node_js: "lts/*",
                        os: "linux",
                        script: ["npm run lint"],
                        stage: "lint"
                    },
                    {
                        stage: "test"
                    },
                    {
                        deploy: obj.deploy,
                        node_js: "lts/*",
                        os: "linux",
                        script: "skip",
                        stage: "deploy"
                    }
                ]
            };
            delete obj.deploy;
            return obj;
        })
        .save();
};
