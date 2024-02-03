import React, { useState } from "react";
import './Board.css';
import AI from './ai/AI.js';
import axios from "axios";

async function updateWins({ username }) {
    try {
        await axios.put(`/api/player/${username}/updateWins`);
    } catch (error) {
        console.error('Error updating win count:', error);
    }
}

function Board({ username, selectedPointer, squares, onPlay }) {
    const [playerTurn, setPlayerTurn] = useState(1);

    function handleClick(i) {
        if (AI.calculateWinner(squares) || squares[i]) return;

        const nextSquares = squares.slice();

        if (playerTurn) {
            nextSquares[i] = selectedPointer === 0 ? 'X' : 'O';
            setPlayerTurn(0);
        } else {
            AI.getMove(squares, selectedPointer, i, onPlay);
            setPlayerTurn(1);
        }
        onPlay(nextSquares);
    }
    const winner = AI.calculateWinner(squares);
    let status;

    if (winner) {
        status = 'Winner: ' + winner === selectedPointer ? 'Player' : 'AI';

        if(winner === selectedPointer) {
            updateWins(username).then(r => "Updated wins");
        }
    } else {
        status = 'Your Turn';
    }

    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </>
    );
}

function Square({ value, onSquareClick }) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

export default Board;