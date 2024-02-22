import {updateWins} from "../../display/PlayerStats";

/**
 * Player object for users playing
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

    isGuest() {
        return this.isGuest;
    }

    updateWins() {
        if(this.isGuest()) return;
        updateWins(this.getUsername()).then(() => history.push('/'));
    }
}