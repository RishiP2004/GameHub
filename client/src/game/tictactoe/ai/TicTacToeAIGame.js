import React, { useState } from "react";
import TicTacToeAIBoard from "./TicTacToeAIBoard";
import TicTacToeGame from "../TicTacToeGame";
import {useHistory} from "react-router-dom";

/**
 * Manages TicTacToe AI game
 *
 * @returns {Element}
 * @constructor
 */
const TicTacToeAIGame = () => {
    const [selectedPointer, setSelectedPointer] = useState(null);
    const [gameKey, setGameKey] = useState(Date.now());
    const history = useHistory();

    const handlePointerSelect = (pointerId) => {
        if (selectedPointer === null) setSelectedPointer(pointerId);
    };
    const handleGameEnd = () => {
        history.push('/'); // Redirect to home or appropriate page
    };

    const handlePlay = (nextSquares) => {};
    const onBack = () => {
        handleGameEnd()
    };

    const onRestart = () => {
        setGameKey(Date.now()); // Unique key to force re-render
    };

    return (
        <div className="game-container">
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
            <TicTacToeGame
                key={gameKey}
                BoardComponent={TicTacToeAIBoard}
                boardProps={{
                    selectedPointer: selectedPointer,
                    onGameEnd: handleGameEnd
                }}
                handlePlay={handlePlay}
                onGameEnd={handleGameEnd}
                onBack={onBack}
            />
            <button className="button-selection" onClick={onRestart}>
                Restart
            </button>
        </div>
    );
};

export default TicTacToeAIGame;
