import { IObj } from "./config.d";

export interface IPackage extends IObj {
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
    scripts?: IObj<string>;
    dependencies?: IObj<string>;
    devDependencies?: IObj<string>;
}

export interface ILintstagedrc extends IObj {
    linters: IObj<string[]>;
    globOptions: IObj;
}

export interface IHuskyrc extends IObj {
    hooks: IObj<string>;
}
