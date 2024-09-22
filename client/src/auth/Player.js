import {updateWins} from "../stats/PlayerStats";

/**
 * Main Player object for users playing
 */
export default class Player {
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