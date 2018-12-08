import * as fs from "fs";
import { IAdapter } from "./adapter.d";

export class Conf<T extends { [name: string]: any }> {
    protected filePath: string;
    protected object: T;
    protected adapter: IAdapter;

    constructor(p: fs.PathLike, adapter: IAdapter) {
        this.filePath = p.toString();
        this.adapter = adapter;

        this.object = this.adapter.read(this.filePath);
    }

    public modify(fn: (obj: T) => T) {
        this.object = fn(this.object);
        return this;
    }

    public save() {
        return this.adapter.write(this.filePath, this.object);
    }

    public toObject() {
        return this.object;
    }
}
