import { Exception } from "./Exception";

export class MailError extends Exception {
    constructor(message?: string) {
        super(1001, message ?? "Mail Error");
    }
}