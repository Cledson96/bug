import { createConfig } from "./env";
import { AppConfig } from "./interfaces";

class Config {
    private appConfig: AppConfig;
    
    constructor () {
        this.appConfig = this.getConfig()
    }

    getConfig(): AppConfig {
        return createConfig()
    }

    get port () {
        return this.appConfig.port;
    }

    get database () {
        return this.appConfig.dataSource;
    }

    get paths () {
        return this.appConfig.paths
    }

    get env () {
        return this.appConfig.env;
    }

    get jwt () {
        return this.appConfig.jwtSecret;
    }

    get secret () {
        return this.appConfig.secret;
    }

    get mail () {
        return this.appConfig.mailSource
    }
}

export default new Config();