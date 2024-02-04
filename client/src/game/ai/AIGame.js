import React, {useState} from "react";
import AIBoard from "./AIBoard";
import '../Game.css';

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

    return  (
        <div>
            <div className="game-board">
                <AIBoard
                    selectedPointer={selectedPointer}
                    squares={currentSquares}
                    onPlay={(nextSquares) => handlePlay(nextSquares)}
                />
            </div>
            <div className="pointer-select">
                <h1>Select a pointer:</h1>
                <ol><span className="pointer-id">X <button onClick={() => handlePointerSelect(0)} disabled={selectedPointer !== null}></button></span></ol>
                <ol><span className="pointer-id">O <button onClick={() => handlePointerSelect(1)} disabled={selectedPointer !== null}></button></span></ol>
            </div>
        </div>
    );
}

export default AIGame;