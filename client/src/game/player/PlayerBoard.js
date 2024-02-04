import React from "react";
import Board from "../Board";
import { updateWins } from "../../display/PlayerStats";
import {useHistory} from "react-router-dom";

class PlayerBoard extends Board {
    constructor({player1, player2, onPlay, setPlayerTurn }) {
        super({ onPlay, setPlayerTurn });
        this.player1 = player1
        this.player2 = player2
        this.history = useHistory();
    }

    async handleClick(i) {
        const { squares, playerTurn, onPlay, setPlayerTurn } = this.getState();
        const nextSquares = squares.slice();
        const winner = super.calculateWinner(nextSquares);
        // 0 is player1, 1 is player2
        if (super.calculateWinner(squares) || squares[i]) return;

        if (playerTurn === 0) {
            nextSquares[i] = this.player1.getPointer() === 0 ? 'X' : 'O';
            setPlayerTurn(1);
        } else {
            nextSquares[i] = this.player2.getPointer() === 0 ? 'X' : 'O';
            setPlayerTurn(0);
        }
        onPlay(nextSquares);

        if (winner) {
            let winningPlayer = this.player1.getPointer() === 0 ? this.player1.getUsername() : this.player2.getUsername();

            updateWins(winningPlayer).then(() => this.history.push('/selection'));
        }
    }

    render() {
        return (
            <div className="board">
                <h2>Player Board</h2>
                {super.render()}
            </div>
        );
    }
}

export default PlayerBoard;