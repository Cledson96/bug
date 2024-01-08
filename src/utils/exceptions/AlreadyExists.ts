import { Exception } from "./Exception";

export class AlreadyExists extends Exception {
    constructor(field?: string) {
        super(409, `Already exists a record with this ${field ?? "id"}`);
    }
}