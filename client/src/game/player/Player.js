class Player {
    constructor({username, pointerId}) {
        this.username = username;
        this.pointerId = pointerId;
    }

    getUsername() {
        return this.username;
    }

    getPointerId() {
        return this.pointerId;
    }
}