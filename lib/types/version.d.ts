export interface IVersion {
    major: number;
    minor: number;
    patch: number;
    toString: () => string;
}

export interface IVersionObject {
    /** 添加文件列表 */
    ADD_LIST?: string[];
    /** 更新文件列表 */
    UPDATE_LIST?: string[];
    /** 删除文件列表 */
    REMOVE_LIST?: string[];
    /** 忽略检查文件列表 */
    IGNORE_CHECK_LIST?: string[];
    update?: (filePoint: string) => any;
}

export interface IVersionExtraObject extends IVersionObject {
    isIgnoreCheck: (filePoint: string) => boolean;
}
