import { Exception } from "./Exception";

export class Unauthorized extends Exception {
    constructor(message?: string) {
        super(401, message ?? "Unauthorized");
    }
}