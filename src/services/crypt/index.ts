import { ICrypt } from "./interfaces";
import Crypto from 'crypto-js';

import config from "@config";

class Crypt implements ICrypt {
    encrypt(value: string): string {    
        if (!value) throw new Error('Erro ao criptografar valor nulo');
        return Crypto.AES.encrypt(value, config.secret).toString();
    }

    decrypt(value: string): string {
        if (!value) throw new Error('Erro ao descriptografar valor nulo');
        return Crypto.AES.decrypt(value, config.secret).toString(Crypto.enc.Utf8);
    }

    compare(value: string, encrypted: string): boolean {
        if (!value || !encrypted) throw new Error('Erro ao comparar valores nulos');
        
        return this.decrypt(encrypted) === value;
    }
}

export default new Crypt();