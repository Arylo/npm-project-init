import * as fs from "fs";
import * as path from "path";
import { Json } from "./json";
import { IPackage } from "./json.d";

export class Pkg extends Json<IPackage> {
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
        return this.deleteSaveDependencies(name);
    }

    public deleteSaveDependencies(...names: string[]) {
        names.forEach((name) => {
            delete this.object.dependencies[name];
        });
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
        return this.deleteDevDependencies(name);
    }

    public deleteDevDependencies(...names: string[]) {
        names.forEach((name) => {
            delete this.object.devDependencies[name];
        });
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
        return this.deleteScript(action);
    }

    public deleteScripts(...actions: string[]) {
        actions.forEach((action) => {
            delete this.object.scripts[action];
        });
        return this;
    }
}
