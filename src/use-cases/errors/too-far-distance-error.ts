
export class TooFarDistanceError extends Error {
    constructor() {
        super('Too far distance between gym and user.')
    }
}