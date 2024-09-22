import {Player} from "../../../auth/Player";

/**
 * Player objects for users playing Connect4
 */
export class Connect4Player extends Player {
    constructor({username, color}) {
        super(username);
        this.username = username;
        this.color = color;
    }
    getColor() {
        return this.color;
    }
}