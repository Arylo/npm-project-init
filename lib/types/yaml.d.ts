import { IObj } from "./config";

export interface ITravis extends IObj {
    language?: string;
    os?: string[];
    node_js?: string[];
    before_script?: string[];
    script?: string[];
    after_script?: string[];
    after_success?: string[];
    before_deploy?: string[];
    deploy: {
        skip_cleanup?: boolean;
        provider?: string;
        email?: string;
        api_key?: string;
        on?: {
            branch?: string;
            node_js?: string;
        };
    } & IObj;
    after_deploy?: string[];
}
