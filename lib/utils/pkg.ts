import * as fs from "fs";
import * as path from "path";
import * as json from "./json";

interface IPkgObj {
    name: string;
    version: string;
    description: string;
    main: string;
    author: string;
    homepage?: string;
    yVersion: string;
    license: string;
    keywords: string[];
    files: string[];
    scripts?: {
        [name: string]: string;
    };
    dependencies?: {
        [name: string]: string;
    };
    devDependencies?: {
        [name: string]: string;
    };
    [key: string]: any;
}

export const read = (p: fs.PathLike): IPkgObj => {
    const filePath = path.resolve(p.toString(), "package.json");
    return json.read(filePath);
};

export const write = (p: fs.PathLike, data: object) => {
    const filePath = path.resolve(p.toString(), "package.json");
    return json.write(filePath, data);
};

export class Pkg extends json.Json<IPkgObj> {
    constructor(p: fs.PathLike) {
        super(path.resolve(p.toString(), "package.json"));
    }

    public getSaveDependency(name: string) {
        return this.object.dependencies[name];
    }

    public updateSaveDependency(name: string, version: string) {
        this.object.dependencies[name] = version;
        return this;
    }

    public deleteSaveDependency(name: string) {
        delete this.object.dependencies[name];
        return this;
    }

    public getDevDependency(name: string) {
        return this.object.devDependencies[name];
    }

    public updateDevDependency(name: string, version: string) {
        this.object.devDependencies[name] = version;
        return this;
    }

    public deleteDevDependency(name: string) {
        delete this.object.devDependencies[name];
        return this;
    }

    public getScript(action: string) {
        return this.object.scripts[action];
    }

    public updateScript(action: string, command?: string) {
        if (command) {
            this.object.scripts[action] = command;
        } else {
            delete this.object.scripts[action];
        }
        return this;
    }

    public deleteScript(action: string) {
        delete this.object.scripts[action];
        return this;
    }
}
