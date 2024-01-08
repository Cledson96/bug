import { Exception } from "./Exception";

export class NotImplemented extends Exception {
    constructor(message?: string) {
        super(501, message ?? "NotImplemented");
    }
}