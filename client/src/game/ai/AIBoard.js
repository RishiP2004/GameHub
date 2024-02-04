import React from "react";
import Board from "../Board";
import AI from "./AI";
import { updateWins } from "../../display/PlayerStats";

class AIBoard extends Board {
    constructor({ onPlay, setPlayerTurn }) {
        super({ onPlay, setPlayerTurn });
        this.username = JSON.parse(localStorage.getItem('user'));
    }

    async handleClick(i) {
        const { squares, playerTurn, selectedPointer, onPlay, setPlayerTurn } = this.getState();
        const nextSquares = squares.slice();
        const winner = super.calculateWinner(nextSquares);

        if (super.calculateWinner(squares) || squares[i]) return;

        if (playerTurn === 0) {
            nextSquares[i] = selectedPointer === 0 ? 'X' : 'O';
            setPlayerTurn(1);
        } else {
            await AI.getMove(squares, selectedPointer, onPlay);
            setPlayerTurn(0);
        }
        onPlay(nextSquares);

        if (winner) {
            const isPlayerWinner = winner === selectedPointer;
            if (isPlayerWinner) {
                updateWins(this.username).then(() => console.log("Updated wins"));
            }
        }
    }

    render() {
        return (
            <div className="board">
                <h2>AI's Board</h2>
                {super.render()}
            </div>
        );
    }
}

export default AIBoard;