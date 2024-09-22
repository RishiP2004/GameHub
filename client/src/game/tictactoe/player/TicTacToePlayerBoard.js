import React, { useState } from "react";
import { calculateWinner } from "../GameUtils";
import { useHistory } from "react-router-dom";
import '../Board.css';
import Square from "../Square";
import {TicTacToe} from "../../GameIds";

/**
 * Handles the Player Board element where the game is
 * being played. Handles clicking the board squares
 * as well as checking if a winner has been found
 * between two players.
 *
 * @param player1
 * @param player2
 * @param squares
 * @param onPlay
 * @returns {JSX.Element}
 * @constructor
 */
const TicTacToePlayerBoard = ({ player1, player2, squares, onPlay }) => {
    const history = useHistory();
    const [playerTurn, setPlayerTurn] = useState(0);

    const handleClick = (i) => {
        const nextSquares = squares.slice();

        if (calculateWinner(nextSquares) || squares[i]) {
            return;
        }
        if (playerTurn === 0) {
            nextSquares[i] = player1.getPointer() === 0 ? 'X' : 'O';
            setPlayerTurn(1);
        } else {
            nextSquares[i] = player2.getPointer() === 0 ? 'X' : 'O';
            setPlayerTurn(0);
        }
        onPlay(nextSquares);

        const newWinner = calculateWinner(nextSquares);

        if (newWinner) {
            const winnerPlayer = newWinner === (player1.getPointer() === 'X' ? 0 : 1) ? player1 : player2;
            winnerPlayer.updateWins(history, TicTacToe);
            history.push('/');
        } else if (nextSquares.every((square) => square !== null)) {
            history.push('/');
        }
    };

    const getStatusMessage = () => {
        const winner = calculateWinner(squares);
        if (winner) {
            const winnerPlayer = winner === (player1.getPointer() === 'X' ? 'X' : 'O') ? player1 : player2;
            return `${winnerPlayer.getUsername()} Wins!`;
        } else if (squares.every((square) => square !== null)) {
            return 'Draw!';
        } else {
            return `${playerTurn === 0 ? player1.getUsername() : player2.getUsername()} Turn`;
        }
    };

    return (
        <div className="game-container">
            <div className="status">{getStatusMessage()}</div>
            <div className="board">
                {[0, 1, 2].map((row) => (
                    <div key={row} className="board-row">
                        {[0, 1, 2].map((col) => (
                            <Square
                                key={col}
                                value={squares[row * 3 + col]}
                                onSquareClick={() => handleClick(row * 3 + col)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TicTacToePlayerBoard;
