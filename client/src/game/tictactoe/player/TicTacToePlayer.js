import {Player} from "../../../auth/Player";

/**
 * Player objects for users playing TicTacToe
 */
export class TicTacToePlayer extends Player {
    constructor({username, pointerId}) {
        super(username);
        this.username = username;
        this.pointerId = pointerId;
    }
    getPointer() {
        return this.pointerId;
    }
}