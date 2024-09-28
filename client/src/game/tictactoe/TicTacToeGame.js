import React, { useState } from "react";
import './TicTacToe.css';

/**
 * Parent TicTacToe manager for children
 *
 * @param BoardComponent
 * @param boardProps
 * @param handlePlay
 * @param onBack
 * @returns {Element}
 * @constructor
 */
const TicTacToeGame = ({ BoardComponent, boardProps, handlePlay, onBack }) => {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const currentSquares = history[currentMove];

    const handlePlayMove = (nextSquares) => {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        handlePlay(nextSquares);
    };

    return (
        <div className="game-container">
            <div className="game-board">
                <BoardComponent
                    squares={currentSquares}
                    onPlay={handlePlayMove}
                    {...boardProps}
                />
            </div>
            <button className="button-selection" onClick={onBack}>
                Back
            </button>
        </div>
    );
};

export default TicTacToeGame;
