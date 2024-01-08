import { Exception } from "./Exception";

export class ServiceUnavailable extends Exception {
    constructor(message?: string) {
        super(503, message ?? "Service Unavailable");
    }
}