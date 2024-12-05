

export class AlreadyCheckingError extends Error {
    constructor() {
        super('User already check in')
    }
}