import React, { useState } from 'react';
import Board from "./Board";
import './Game.css';

function Game({username}) {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [selectedPointer, setSelectedPointer] = useState(0);
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }
    //todo: dont change selected pointer after game starts.
    return (
        <div className="game">
            <div className="game-board">
                <Board username = {username} selectedPointer={selectedPointer} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="pointer-select">
                <h1>Select a pointer:</h1>
                <ol><span className="pointer-id">X <button onClick={() => setSelectedPointer(0)}></button></span></ol>
                <ol><span className="pointer-id">O <button onClick={() => setSelectedPointer(1)}></button></span></ol>
            </div>
        </div>
    );
}

export default Game;