import { Exception } from "./Exception";

export class ValidationError extends Exception {
    constructor(message?: string) {
        super(422, message ?? "Validation Error");
    }
}