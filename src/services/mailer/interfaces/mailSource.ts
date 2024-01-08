export interface IMailSource {
    type: 'SMTP';
    pool: boolean;
    host: string;
    port: number;
    secure: boolean;
    service?: string;
    auth: {
        user: string;
        pass: string;
    };
    tls?: {
        rejectUnauthorized?: boolean;
        ciphers?: string;
    };
}

export interface IMailSourceOAuth2 {
    type: 'OAuth2';
    pool?: boolean;
    service?: string;
    secure: boolean;
    tls?: {
        rejectUnauthorized?: boolean;
        ciphers?: string;
    }
    auth: {
        type: string;
        user: string;
        clientId: string;
        clientSecret: string;
        refreshToken: string;
        accessToken?: string;
        expires?: number;
    };
}