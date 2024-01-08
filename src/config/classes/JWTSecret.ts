import { IJWTSecret } from "../interfaces";

export class JWTSecret implements IJWTSecret{
    public secret: string;
    public expiration: string;

    constructor(secret: string, expiration: string) {
        this.secret = secret;
        this.expiration = expiration;
    }
}