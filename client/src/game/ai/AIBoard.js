import React, {useState} from "react";
import { updateWins } from "../../display/PlayerStats";
import {calculateWinner, Square} from "../GameUtils";
import getAIMove from "./AI";
import '../Board.css';
import {useHistory} from "react-router-dom";

/**
 * Handles the AI Board element where the game is
 * being played. Handles clicking the board squares
 * as well as checking if a winner has been found
 *
 * @param selectedPointer
 * @param squares
 * @param onPlay
 * @returns {JSX.Element}
 * @constructor
 */
const AIBoard = ({selectedPointer, squares, onPlay}) => {
    const username = JSON.parse(localStorage.getItem('user'));
    const guestMode = JSON.parse(localStorage.getItem('user')) === 0;

    const [playerTurn, setPlayerTurn] = useState(0);
    const history = useHistory();

    let status = playerTurn === selectedPointer ? 'Your Turn' : 'AI Turn';

    async function handleClick(i) {
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

        if (!winner && nextSquares.every((square) => square !== null)) {
            status = 'Draw!';
            history.push('/');
            return;
        }
        if (newWinner) {
            const isPlayerWinner = newWinner === selectedPointer;
            status = isPlayerWinner ? 'Winner: Player' : 'Winner: AI';

            if (isPlayerWinner && guestMode === false) {
                updateWins(username).then(() => console.log("Updated wins"));
            }
            history.push('/');
        } else {
            setPlayerTurn((prevPlayerTurn) => 1 - prevPlayerTurn);
        }
    }

    return (
        <>
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
        </>
    );
}

export default AIBoard;