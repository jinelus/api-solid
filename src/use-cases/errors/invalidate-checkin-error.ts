

export class InvalidateError extends Error {
    constructor() {
        super('Check-in can be validated only until 20 minutes of its creation.');
    }
}