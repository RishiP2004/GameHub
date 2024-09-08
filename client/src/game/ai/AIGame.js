import React, { useState } from "react";
import AIBoard from "./AIBoard";
import "../Game.css";

/**
 * Overseer of the AIBoard and handles
 * history, pointer select and current moves.
 *
 * @returns {JSX.Element}
 * @constructor
 */
const AIGame = () => {
    const [selectedPointer, setSelectedPointer] = useState(null);
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const currentSquares = history[currentMove];

    const handlePlay = (nextSquares) => {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    };

    const handlePointerSelect = (pointerId) => {
        if (selectedPointer === null) setSelectedPointer(pointerId);
    };

    return (
        <div className="game-container">
            <div className="game-board">
                <AIBoard
                    selectedPointer={selectedPointer}
                    squares={currentSquares}
                    onPlay={handlePlay}
                />
            </div>
            <div className="pointer-select">
                <h1>Select a pointer:</h1>
                <div className="pointer-options">
                    <button
                        className="pointer-button"
                        onClick={() => handlePointerSelect(0)}
                        disabled={selectedPointer !== null}>
                        X
                    </button>
                    <button
                        className="pointer-button"
                        onClick={() => handlePointerSelect(1)}
                        disabled={selectedPointer !== null}>
                        O
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AIGame;
