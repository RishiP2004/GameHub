import {updateWins} from "../display/PlayerStats";

/**
 * Player objects for users playing
 */
export class Player {
    constructor(username) {
        this.username = username;
    }

    getUsername() {
        return this.username;
    }

    checkIsGuest() {
        return JSON.parse(localStorage.getItem('user')) === 0;
    }

    updateWins(history, game) {
        if(this.checkIsGuest()) return;
        updateWins(this.getUsername(), game).then(() => history.push('/'));
    }
}