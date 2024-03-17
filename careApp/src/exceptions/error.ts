import { Errors } from "./types";

export class ErrorInstance extends Error {
    code: Errors;

    constructor(code: Errors) {
        super('Error');
        this.code = code;
    }
}
