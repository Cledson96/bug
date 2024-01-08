import { Exception } from "./Exception";

export class Forbidden extends Exception {
    constructor(message?: string) {
        super(403, message ?? "Forbidden");
    }
}