import { Exception } from "./Exception";

export class NotFound extends Exception {
    constructor(message?: string) {
        super(404, message ?? "Not Found");
    }
}