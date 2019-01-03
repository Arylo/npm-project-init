import * as fs from "fs";
import * as ftconfig from "ftconfig";
import { WriteConfig } from "ftconfig/lib/WriteConfig";
import * as path from "path";
import { IPackage } from "../types/json";

export class Pkg {
    private config: WriteConfig<IPackage>;

    constructor(p: fs.PathLike) {
        const filepath = path.resolve(p.toString(), "package.json");
        this.config = ftconfig.readFile<IPackage>(filepath, { type: "json" });
    }

    public save() {
        this.config.save();
        return this;
    }

    public modify(fn: (obj: IPackage) => IPackage) {
        this.config.modify(fn);
        return this;
    }

    public toObject() {
        return this.config.toObject();
    }

    public getSaveDependency(name: string) {
        return this.toObject().dependencies[name];
    }

    public updateSaveDependency(name: string, version: string) {
        this.config.modify((obj) => {
            obj.dependencies[name] = version;
            return obj;
        });
        return this;
    }

    public deleteSaveDependency(name: string) {
        return this.deleteSaveDependencies(name);
    }

    public deleteSaveDependencies(...names: string[]) {
        this.config.modify((object) => {
            names.forEach((name) => {
                delete object.dependencies[name];
            });
            return object;
        });
        return this;
    }

    public getDevDependency(name: string) {
        return this.toObject().devDependencies[name];
    }

    public updateDevDependency(name: string, version: string) {
        this.config.modify((object) => {
            object.devDependencies[name] = version;
            return object;
        });
        return this;
    }

    public deleteDevDependency(name: string) {
        return this.deleteDevDependencies(name);
    }

    public deleteDevDependencies(...names: string[]) {
        this.config.modify((object) => {
            names.forEach((name) => {
                delete object.devDependencies[name];
            });
            return object;
        });
        return this;
    }

    public getScript(action: string) {
        return this.toObject().scripts[action];
    }

    public updateScript(action: string, command?: string) {
        this.config.modify((object) => {
            if (command) {
                object.scripts[action] = command;
            } else {
                delete object.scripts[action];
            }
            return object;
        });
        return this;
    }

    public deleteScript(action: string) {
        return this.deleteScript(action);
    }

    public deleteScripts(...actions: string[]) {
        this.config.modify((object) => {
            actions.forEach((action) => {
                delete object.scripts[action];
            });
            return object;
        });
        return this;
    }
}
