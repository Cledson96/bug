export interface ICrypt {
    encrypt(value: string): string;
    decrypt(value: string): string;
    compare(value: string, encrypted: string): boolean;
}