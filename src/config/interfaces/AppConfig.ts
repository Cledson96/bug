import { IMailSource, IMailSourceOAuth2 } from "@service/interfaces";
import { IJWTSecret } from "./JWTSecret";
import { IAWS } from "./AWS";
import { IDataSource } from "atlasdb:database";

export interface AppConfig {
    env: 'dev' | 'stg' | 'prd' ,
    port: {
        server: number,
        socket: number
    },
    aws: IAWS
    paths: {
        src: string,
        editais: string,
        logs: string
    },
    dataSource: IDataSource,
    jwtSecret: IJWTSecret,
    secret: string,
    mailSource: IMailSource | IMailSourceOAuth2
}