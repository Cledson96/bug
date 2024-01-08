import { Dialect } from "sequelize";
import { AppConfig } from "./interfaces";

import { dirname } from '@util/directory';
import { join } from "path";

import dotenv from 'dotenv';

export function createConfig(): AppConfig {
    const env = process.env.NODE_ENV ?? 'dev';
    
    dotenv.config({ path: `${env.toLowerCase()}.env` });

    return {
        env,
        port: {
            server: parseInt(process.env.PORT!),
            socket: parseInt(process.env.SOCKET_PORT!)
        },
        paths: {
            src: join(dirname(), 'src'),
            logs: join(dirname(), 'logs'),
            editais: process.env.EDITAIS_FOLDER_PATH!,
        },
        dataSource: {
            scope: process.env.DB_SCOPE!,
            host: process.env.DB_HOST!,
            port: parseInt(process.env.DB_PORT!),
            user: process.env.DB_USER!,
            password: process.env.DB_PASSWORD!,
            database: process.env.DB_NAME!,
            dialect: process.env.DB_DIALECT! as Dialect,
            logging: false,
            timezone: process.env.DB_TIMEZONE!,
            pool: {
                max: parseInt(process.env.DB_POOL_MAX!),
                min: parseInt(process.env.DB_POOL_MIN!),
                acquire: parseInt(process.env.DB_POOL_ACQUIRE!),
                idle: parseInt(process.env.DB_POOL_IDLE!)
            }
        },
        jwtSecret: {
            secret: process.env.JWT_SECRET!,
            expiration: process.env.JWT_EXPIRATION ?? '30d'
        },
        aws:{
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            bucket: process.env.AWS_BUCKET || '',
            region: process.env.AWS_REGION || '', 
            secretKey: process.env.AWS_SECRET_KEY || ''
        },
        secret: process.env.SECRET!,
        mailSource: {
            type: 'OAuth2',
            secure: true,
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USER!,
                clientId: process.env.MAIL_CLIENT_ID!,
                clientSecret: process.env.MAIL_CLIENT_SECRET!,
                refreshToken: process.env.MAIL_REFRESH_TOKEN!,
                accessToken: process.env.MAIL_ACCESS_TOKEN!,
            },
            tls: {
                rejectUnauthorized: false
            }
        }
    }
}