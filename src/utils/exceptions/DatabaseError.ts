import { Exception } from "./Exception";

export class DatabaseError extends Exception {
    constructor(message?: string) {
        super(901, message ?? "Database Error");
    }
}