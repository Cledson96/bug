import { Exception } from "./Exception";

export class InternalServerError extends Exception {
    constructor(message?: string) {
        super(500, message ?? "Internal Server Error");
    }
}