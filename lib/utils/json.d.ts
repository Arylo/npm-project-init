export interface IAnyObj {
    [key: string]: any;
}

export interface IPackage extends IAnyObj {
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
}

export interface ILintstagedrc extends IAnyObj {
    linters: {
        [key: string]: string[];
    };
    globOptions: {
        [key: string]: any;
    };
}

export interface IHuskyrc extends IAnyObj {
    hooks: {
        [key: string]: string;
    };
}
