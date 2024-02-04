import React, { useState } from "react";
import PlayerBoard from "./PlayerBoard";
import { useParams } from "react-router-dom";
import '../Game.css';

const PlayerGame = () => {
    const { player1, player2 } = useParams();
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const currentSquares = history[currentMove];

    const player1Instance = new Player({ username: player1, pointerId: 0 });
    const player2Instance = new Player({ username: player2, pointerId: 0 });

    const handlePlay = (nextSquares) => {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    };

    return (
        <div>
            <div className="game-board">
                <PlayerBoard
                    player1={player1Instance}
                    player2={player2Instance}
                    squares={currentSquares}
                    onPlay={(nextSquares) => handlePlay(nextSquares)}
                />
            </div>
        </div>
    );
}

export default PlayerGame;