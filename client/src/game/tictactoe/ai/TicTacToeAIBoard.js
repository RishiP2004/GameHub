import React, { useState } from "react";
import { calculateWinner } from "../GameUtils";
import getAIMove from "./TicTacToeAI";
import '../Board.css';
import { useHistory } from "react-router-dom";
import { Square } from "../Square";

/**
 * Handles the AI Board element where the game is
 * being played. Handles clicking the board squares
 * as well as checking if a winner has been found.
 *
 * @param selectedPointer
 * @param squares
 * @param onPlay
 * @returns {JSX.Element}
 * @constructor
 */
const TicTacToeAIBoard = ({ selectedPointer, squares, onPlay }) => {
    const username = JSON.parse(localStorage.getItem('user'));
    const guestMode = JSON.parse(localStorage.getItem('user')) === 0;

    const [playerTurn, setPlayerTurn] = useState(0);
    const history = useHistory();

    let status = playerTurn === selectedPointer ? 'Your Turn' : 'AI Turn';

    async function handleClick(i) {
        if (selectedPointer == null) {
            return;
        }
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = selectedPointer === 0 ? 'X' : 'O';
        onPlay(nextSquares);

        const winner = calculateWinner(nextSquares);

        if (!winner) {
            await getAIMove(nextSquares, selectedPointer, onPlay);
        }

        const newWinner = calculateWinner(nextSquares);

        if (!newWinner && nextSquares.every((square) => square !== null)) {
            status = 'Draw!';
            history.push('/');
            return;
        }
        if (newWinner) {
            const isPlayerWinner = newWinner === selectedPointer;
            status = isPlayerWinner ? 'Winner: Player' : 'Winner: AI';

            history.push('/');
        } else {
            setPlayerTurn((prevPlayerTurn) => 1 - prevPlayerTurn);
        }
    }

    return (
        <div className="game-container">
            <div className="status">{status}</div>
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

export default TicTacToeAIBoard;
