import { Exception } from "./Exception";

export class BadRequest extends Exception {
    constructor(message?: string) {
        super(400, message ?? "Bad Request");
    }
}