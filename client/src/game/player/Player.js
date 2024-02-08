/**
 * Player object for users playing
 */
class Player {
    constructor({username, pointerId}) {
        this.username = username;
        this.pointerId = pointerId;
    }

    getUsername() {
        return this.username;
    }

    getPointer() {
        return this.pointerId;
    }
}