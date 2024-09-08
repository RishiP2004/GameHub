import {updateWins} from "../../display/PlayerStats";

/**
 * Player objects for users playing
 */
export class Player {
    constructor({username, pointerId, isGuest}) {
        this.username = username;
        this.pointerId = pointerId;
        this.isGuest = isGuest;
    }

    getUsername() {
        return this.username;
    }

    getPointer() {
        return this.pointerId;
    }

    checkIsGuest() {
        return this.isGuest;
    }

    updateWins(history) {
        if(this.checkIsGuest()) return;
        updateWins(this.getUsername()).then(() => history.push('/'));
    }
}