import React, {useState} from "react";
import { updateWins } from "../../display/PlayerStats";
import {calculateWinner, Square} from "../GameUtils";
import getAIMove from "./AI";
import '../Board.css';

const AIBoard = ({selectedPointer, squares, onPlay}) => {
    const username = JSON.parse(localStorage.getItem('user'));
    const [ playerTurn, setPlayerTurn ]= useState(0);
    let status;

    async function handleClick(i) {
        const nextSquares = squares.slice();
        const winner = calculateWinner(nextSquares);

        if (calculateWinner(squares) || squares[i]) return;

        if (playerTurn === 0) {
            nextSquares[i] = selectedPointer === 0 ? 'X' : 'O';
            setPlayerTurn(1);
        } else {
            await getAIMove(squares, selectedPointer, onPlay);
            setPlayerTurn(0);
        }
        onPlay(nextSquares);

        if (winner) {
            status = 'Winner: ' + (winner === selectedPointer ? 'Player' : 'AI');

            const isPlayerWinner = winner === selectedPointer;
            if (isPlayerWinner) {
                updateWins(username).then(() => console.log("Updated wins"));
            }
        } else {
            status = 'Your Turn';
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