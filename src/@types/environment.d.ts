
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV?: "dev" | "stg" | "prd";
            PORT?: string;
            SOCKET_PORT?: string;
            EDITAIS_FOLDER_PATH?: string;
            DB_SCOPE?: 'atlas' | 'orion';
            DB_PORT?: string;
            DB_HOST?: string;
            DB_USER?: string;
            DB_PASSWORD?: string;
            DB_NAME?: string;
            DB_DIALECT?: string;
            DB_TIMEZONE?: string;
            DB_POOL_MAX?: string;
            DB_POOL_MIN?: string;
            DB_POOL_ACQUIRE?: string;
            DB_POOL_IDLE?: string;
            JWT_SECRET?: string;
            JWT_EXPIRATION?: string;
            SECRET?: string;
            MAIL_HOST?: string;
            MAIL_PORT?: string;
            MAIL_USER?: string;
            MAIL_PASSWORD?: string;
            MAIL_REFRESH_TOKEN?: string;
            MAIL_ACCESS_TOKEN?: string;
            MAIL_CLIENT_ID?: string;
            MAIL_CLIENT_SECRET?: string;
        }
    }
}

export {};
